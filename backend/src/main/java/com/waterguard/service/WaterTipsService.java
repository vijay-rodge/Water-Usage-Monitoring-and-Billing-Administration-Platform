package com.waterguard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.waterguard.dto.DashboardDto;
import com.waterguard.model.Alert;
import com.waterguard.model.Household;
import com.waterguard.model.MeterReading;
import com.waterguard.repository.AlertRepository;
import com.waterguard.repository.HouseholdRepository;
import com.waterguard.repository.MeterReadingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class WaterTipsService {

    private final HouseholdRepository householdRepository;
    private final MeterReadingRepository meterReadingRepository;
    private final AlertRepository alertRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    // In-memory cache for tips (Key: householdId_year_month)
    private final Map<String, CacheEntry> tipsCache = new ConcurrentHashMap<>();

    private static class CacheEntry {
        final DashboardDto.ResidentWaterTipsResponse response;
        final long timestamp;

        CacheEntry(DashboardDto.ResidentWaterTipsResponse response) {
            this.response = response;
            this.timestamp = System.currentTimeMillis();
        }

        boolean isExpired() {
            // Expire after 12 hours
            return System.currentTimeMillis() - timestamp > TimeUnit.HOURS.toMillis(12);
        }
    }

    public DashboardDto.ResidentWaterTipsResponse getPersonalizedWaterTips(Long householdId, boolean forceRefresh) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new IllegalArgumentException("Household not found: " + householdId));

        LocalDate now = LocalDate.now();
        String cacheKey = "resident_tips_" + householdId + "_" + now.getYear() + "_" + now.getMonthValue();

        // 1. Caching check: Return cached tips if available and fresh
        if (!forceRefresh) {
            CacheEntry entry = tipsCache.get(cacheKey);
            if (entry != null && !entry.isExpired()) {
                log.info("Returning cached water tips for household {}", householdId);
                DashboardDto.ResidentWaterTipsResponse cached = entry.response;
                cached.setSource("cache");
                return cached;
            }
        }

        // 2. Fetch Usage Data from PostgreSQL & Calculate Metrics on Backend
        LocalDate startOfMonth = now.withDayOfMonth(1);
        List<MeterReading> monthReadings = meterReadingRepository.findByHouseholdIdAndReadingDateBetweenOrderByReadingDateAsc(
                householdId, startOfMonth, now
        );

        BigDecimal currentMonthConsumption = monthReadings.stream()
                .map(MeterReading::getDailyConsumptionLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDate startOfPrevMonth = startOfMonth.minusMonths(1);
        LocalDate endOfPrevMonth = startOfMonth.minusDays(1);
        BigDecimal prevMonthConsumption = meterReadingRepository.sumConsumptionByHouseholdAndDateRange(
                householdId, startOfPrevMonth, endOfPrevMonth
        );
        if (prevMonthConsumption == null) prevMonthConsumption = new BigDecimal("12000.00");

        int daysElapsed = Math.max(1, monthReadings.size());
        BigDecimal dailyAvg = currentMonthConsumption.divide(new BigDecimal(daysElapsed), 1, RoundingMode.HALF_UP);

        // Calculate Month-over-Month Change & Trend
        BigDecimal percentageChange = BigDecimal.ZERO;
        String trend = "stable";
        if (prevMonthConsumption.compareTo(BigDecimal.ZERO) > 0) {
            // Extrapolate current month to 30 days for accurate MoM comparison
            BigDecimal extrapolatedCurrent = dailyAvg.multiply(new BigDecimal(now.lengthOfMonth()));
            percentageChange = extrapolatedCurrent.subtract(prevMonthConsumption)
                    .divide(prevMonthConsumption, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(1, RoundingMode.HALF_UP);

            if (percentageChange.compareTo(new BigDecimal("5.0")) > 0) {
                trend = "increasing";
            } else if (percentageChange.compareTo(new BigDecimal("-5.0")) < 0) {
                trend = "decreasing";
            } else {
                trend = "stable";
            }
        }

        // Historical 3-month average
        LocalDate threeMonthsAgoStart = startOfMonth.minusMonths(3);
        BigDecimal historicalSum = meterReadingRepository.sumConsumptionByHouseholdAndDateRange(
                householdId, threeMonthsAgoStart, endOfPrevMonth
        );
        BigDecimal averageMonthlyUsage = (historicalSum != null && historicalSum.compareTo(BigDecimal.ZERO) > 0)
                ? historicalSum.divide(new BigDecimal("3"), 1, RoundingMode.HALF_UP)
                : prevMonthConsumption;

        int occupancy = (household.getOccupancyCount() != null && household.getOccupancyCount() > 0)
                ? household.getOccupancyCount()
                : 4;

        List<Alert> alerts = alertRepository.findByHouseholdIdOrderByCreatedAtDesc(householdId);
        boolean hasActiveAnomaly = alerts.stream().anyMatch(a -> !a.getIsResolved() &&
                ("LEAK_DETECTED".equals(a.getAlertType()) || "USAGE_SPIKE".equals(a.getAlertType())));

        // 3. Isolated Gemini Call with Strict Timeout & Minimal Data
        try {
            DashboardDto.ResidentWaterTipsResponse geminiResult = callGeminiForTipsWithTimeout(
                    household, occupancy, currentMonthConsumption, prevMonthConsumption,
                    averageMonthlyUsage, dailyAvg, percentageChange, trend, hasActiveAnomaly
            );

            if (geminiResult != null && geminiResult.getTips() != null && !geminiResult.getTips().isEmpty()) {
                geminiResult.setHouseholdId(household.getId());
                geminiResult.setFlatNo(household.getFlatNo());
                geminiResult.setResidentName(household.getOwnerName());
                geminiResult.setTrend(trend);
                geminiResult.setPercentageChange(percentageChange);
                geminiResult.setCurrentMonthUsage(currentMonthConsumption);
                geminiResult.setPreviousMonthUsage(prevMonthConsumption);
                geminiResult.setAverageMonthlyUsage(averageMonthlyUsage);
                geminiResult.setSuccess(true);
                geminiResult.setSource("gemini");
                geminiResult.setGeneratedBy("Gemini AI Water Assistant");
                geminiResult.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));

                // Store in cache
                tipsCache.put(cacheKey, new CacheEntry(geminiResult));
                return geminiResult;
            }
        } catch (Exception e) {
            log.warn("Gemini call for water tips failed ({}), gracefully switching to personalized fallback tips.", e.getMessage());
        }

        // 4. Personalized Fallback (Never fail, never block dashboard)
        DashboardDto.ResidentWaterTipsResponse fallbackTips = generatePersonalizedFallbackTips(
                household, occupancy, currentMonthConsumption, prevMonthConsumption,
                averageMonthlyUsage, dailyAvg, percentageChange, trend, hasActiveAnomaly
        );
        tipsCache.put(cacheKey, new CacheEntry(fallbackTips));
        return fallbackTips;
    }

    private DashboardDto.ResidentWaterTipsResponse callGeminiForTipsWithTimeout(
            Household household, int occupancy, BigDecimal currentUsage, BigDecimal prevUsage,
            BigDecimal avgUsage, BigDecimal dailyAvg, BigDecimal percentageChange, String trend,
            boolean hasActiveAnomaly
    ) {
        // Enforce 6-second timeout so Gemini never delays the UI
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<DashboardDto.ResidentWaterTipsResponse> future = executor.submit(() -> {
            String prompt = String.format(
                    "You are a water conservation assistant.\n\n" +
                    "Generate practical and easy-to-follow water-saving tips for a resident based on their water usage data.\n\n" +
                    "Resident information:\n" +
                    "- Household size: %d persons\n" +
                    "- Property type: %s\n" +
                    "- Current monthly usage: %s liters\n" +
                    "- Previous monthly usage: %s liters\n" +
                    "- Average monthly usage: %s liters\n" +
                    "- Usage trend: %s\n" +
                    "- Month-over-month change: %s%%\n" +
                    "- Daily average usage: %s liters/day\n" +
                    "- Has active leaks or spikes: %s\n\n" +
                    "Requirements:\n" +
                    "1. Generate 3 to 5 personalized water-saving tips.\n" +
                    "2. Tips must be practical for a normal household.\n" +
                    "3. Base recommendations on the provided usage information.\n" +
                    "4. Do not invent information about the resident.\n" +
                    "5. Do not provide medical, legal, or financial advice.\n" +
                    "6. Keep each tip short and easy to understand.\n" +
                    "7. Avoid repeating the same recommendation.\n" +
                    "8. Do not mention that you are an AI.\n" +
                    "9. Return ONLY valid JSON (no markdown formatting, no backticks).\n\n" +
                    "Required JSON format:\n" +
                    "{\n" +
                    "  \"headline\": \"Short personalized headline\",\n" +
                    "  \"consumptionSummary\": \"Brief summary of their consumption pattern\",\n" +
                    "  \"tips\": [\n" +
                    "    {\n" +
                    "      \"title\": \"Short title\",\n" +
                    "      \"message\": \"Short practical recommendation\",\n" +
                    "      \"priority\": \"high | medium | low\",\n" +
                    "      \"potentialSavings\": \"e.g. Save ~40 L/day\"\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}",
                    occupancy,
                    household.getBhkType() != null ? household.getBhkType() : "Apartment",
                    currentUsage.toPlainString(),
                    prevUsage.toPlainString(),
                    avgUsage.toPlainString(),
                    trend,
                    percentageChange.toPlainString(),
                    dailyAvg.toPlainString(),
                    hasActiveAnomaly ? "yes" : "no"
            );

            String raw = geminiService.generateAnswer(
                    "You are a helpful water conservation specialist. Always output strictly valid JSON.",
                    null,
                    prompt,
                    null,
                    "gemini-2.5-flash"
            );

            if (raw == null || raw.isBlank() || raw.contains("Gemini API Key Required") || raw.startsWith("I apologize")) {
                throw new IllegalStateException("Gemini returned non-operational response: " + raw);
            }

            String cleanJson = raw.trim();
            if (cleanJson.startsWith("```json")) cleanJson = cleanJson.substring(7);
            else if (cleanJson.startsWith("```")) cleanJson = cleanJson.substring(3);
            if (cleanJson.endsWith("```")) cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
            cleanJson = cleanJson.trim();

            int firstBrace = cleanJson.indexOf('{');
            int lastBrace = cleanJson.lastIndexOf('}');
            if (firstBrace >= 0 && lastBrace > firstBrace) {
                cleanJson = cleanJson.substring(firstBrace, lastBrace + 1).trim();
            }

            JsonNode root = objectMapper.readTree(cleanJson);
            List<DashboardDto.WaterTipItem> tipList = new ArrayList<>();

            if (root.has("tips") && root.get("tips").isArray()) {
                int idCounter = 1;
                for (JsonNode tNode : root.get("tips")) {
                    String title = tNode.has("title") ? tNode.get("title").asText() : "Conserve water";
                    String message = tNode.has("message") ? tNode.get("message").asText() : (tNode.has("description") ? tNode.get("description").asText() : "");
                    String priority = tNode.has("priority") ? tNode.get("priority").asText().toLowerCase() : "medium";
                    String savings = tNode.has("potentialSavings") ? tNode.get("potentialSavings").asText() : "Save ~35 L/day";

                    String icon = "droplets";
                    if (title.toLowerCase().contains("leak") || title.toLowerCase().contains("tap")) icon = "faucet";
                    else if (title.toLowerCase().contains("shower")) icon = "shower";
                    else if (title.toLowerCase().contains("wash") || title.toLowerCase().contains("laundry")) icon = "washer";

                    tipList.add(DashboardDto.WaterTipItem.builder()
                            .id("tip-" + (idCounter++))
                            .category("Smart Conservation")
                            .title(title)
                            .message(message)
                            .description(message)
                            .priority(priority)
                            .potentialSavings(savings)
                            .iconType(icon)
                            .build());
                }
            }

            if (tipList.isEmpty()) {
                throw new IllegalStateException("Parsed JSON contained empty tips array");
            }

            String headline = root.has("headline") ? root.get("headline").asText() : "Personalized Conservation Plan for Flat " + household.getFlatNo();
            String summary = root.has("consumptionSummary") ? root.get("consumptionSummary").asText() : "Daily average is currently " + dailyAvg.toPlainString() + " L/day.";

            return DashboardDto.ResidentWaterTipsResponse.builder()
                    .headline(headline)
                    .consumptionSummary(summary)
                    .tips(tipList)
                    .potentialMonthlySavingsEstimate("Save up to 15-20% monthly")
                    .build();
        });

        try {
            return future.get(6, TimeUnit.SECONDS);
        } catch (TimeoutException te) {
            future.cancel(true);
            log.warn("Gemini water tips generation timed out after 6 seconds.");
            return null;
        } catch (Exception e) {
            log.warn("Error executing Gemini water tips call: {}", e.getMessage());
            return null;
        } finally {
            executor.shutdownNow();
        }
    }

    private DashboardDto.ResidentWaterTipsResponse generatePersonalizedFallbackTips(
            Household household, int occupancy, BigDecimal currentUsage, BigDecimal prevUsage,
            BigDecimal avgUsage, BigDecimal dailyAvg, BigDecimal percentageChange, String trend,
            boolean hasActiveAnomaly
    ) {
        List<DashboardDto.WaterTipItem> fallbackList = new ArrayList<>();
        String headline;
        String summary;

        if ("increasing".equals(trend) || hasActiveAnomaly) {
            headline = "Elevated Consumption Detected for Flat " + household.getFlatNo();
            summary = "Your usage is up by " + percentageChange.abs() + "% compared to last month. Taking action on high-flow points will reduce your upcoming water bill.";

            fallbackList.add(DashboardDto.WaterTipItem.builder()
                    .id("fallback-1")
                    .category("Leak Prevention")
                    .title("Check for fixture leaks & running toilets")
                    .message("Your recent usage is above your 3-month average. Check taps, toilets, and visible pipes for trickling leaks.")
                    .description("Your recent usage is above your 3-month average. Check taps, toilets, and visible pipes for trickling leaks.")
                    .priority("high")
                    .potentialSavings("Save ~60 L/day")
                    .iconType("alert")
                    .build());

            fallbackList.add(DashboardDto.WaterTipItem.builder()
                    .id("fallback-2")
                    .category("Bathroom Conservation")
                    .title("Reduce shower time by 2-3 minutes")
                    .message("Your water usage increased this month. Shorter showers can save up to 35-40 liters per person every day.")
                    .description("Your water usage increased this month. Shorter showers can save up to 35-40 liters per person every day.")
                    .priority("high")
                    .potentialSavings("Save ~40 L/day")
                    .iconType("shower")
                    .build());

            fallbackList.add(DashboardDto.WaterTipItem.builder()
                    .id("fallback-3")
                    .category("Kitchen & Appliances")
                    .title("Operate washing machines with full loads")
                    .message("Washing full laundry loads minimizes wasted cycle water and significantly cuts utility charges.")
                    .description("Washing full laundry loads minimizes wasted cycle water and significantly cuts utility charges.")
                    .priority("medium")
                    .potentialSavings("Save ~50 L/load")
                    .iconType("washer")
                    .build());
        } else if ("decreasing".equals(trend)) {
            headline = "Excellent Water Conservation Progress for Flat " + household.getFlatNo();
            summary = "Your consumption decreased by " + percentageChange.abs() + "% compared to last month! Maintain these sustainable habits.";

            fallbackList.add(DashboardDto.WaterTipItem.builder()
                    .id("fallback-1")
                    .category("Habit Reinforcement")
                    .title("Maintain consistent water-saving habits")
                    .message("Your lower consumption shows great discipline. Continue turning off taps while brushing or lathering.")
                    .description("Your lower consumption shows great discipline. Continue turning off taps while brushing or lathering.")
                    .priority("low")
                    .potentialSavings("Maintained ~45 L/day savings")
                    .iconType("leaf")
                    .build());

            fallbackList.add(DashboardDto.WaterTipItem.builder()
                    .id("fallback-2")
                    .category("Fixtures")
                    .title("Clean faucet aerators regularly")
                    .message("Cleaning aerators prevents sediment buildup and keeps water stream smooth with low flow.")
                    .description("Cleaning aerators prevents sediment buildup and keeps water stream smooth with low flow.")
                    .priority("medium")
                    .potentialSavings("Maintains 30% aeration savings")
                    .iconType("faucet")
                    .build());

            fallbackList.add(DashboardDto.WaterTipItem.builder()
                    .id("fallback-3")
                    .category("Water Reuse")
                    .title("Reuse suitable water for plants")
                    .message("Water used for rinsing vegetables or fruits can be redirected to balcony pots and plants.")
                    .description("Water used for rinsing vegetables or fruits can be redirected to balcony pots and plants.")
                    .priority("medium")
                    .potentialSavings("Save ~15 L/day")
                    .iconType("droplets")
                    .build());
        } else {
            headline = "Stable Usage Profile for Flat " + household.getFlatNo();
            summary = "Your water draw is steady at approximately " + dailyAvg.toPlainString() + " L/day (" + (occupancy > 0 ? dailyAvg.divide(new BigDecimal(occupancy), 0, RoundingMode.HALF_UP) : 100) + " L/person).";

            fallbackList.add(DashboardDto.WaterTipItem.builder()
                    .id("fallback-1")
                    .category("Efficiency Optimization")
                    .title("Install low-flow tap aerators")
                    .message("Adding inexpensive aerators to sink taps can reduce water flow by 30-50% without reducing pressure.")
                    .description("Adding inexpensive aerators to sink taps can reduce water flow by 30-50% without reducing pressure.")
                    .priority("medium")
                    .potentialSavings("Save ~25 L/day")
                    .iconType("faucet")
                    .build());

            fallbackList.add(DashboardDto.WaterTipItem.builder()
                    .id("fallback-2")
                    .category("Dual Flush Check")
                    .title("Check toilet flush mechanism")
                    .message("Ensure dual-flush valves reset properly. A sticking flush valve can silently waste up to 200 L overnight.")
                    .description("Ensure dual-flush valves reset properly. A sticking flush valve can silently waste up to 200 L overnight.")
                    .priority("high")
                    .potentialSavings("Prevents 100-200 L loss")
                    .iconType("alert")
                    .build());

            fallbackList.add(DashboardDto.WaterTipItem.builder()
                    .id("fallback-3")
                    .category("Conservation Habits")
                    .title("Turn off taps when water is not actively needed")
                    .message("Do not leave running water while shaving, washing dishes, or scrubbing surfaces.")
                    .description("Do not leave running water while shaving, washing dishes, or scrubbing surfaces.")
                    .priority("medium")
                    .potentialSavings("Save ~30 L/day")
                    .iconType("droplets")
                    .build());
        }

        return DashboardDto.ResidentWaterTipsResponse.builder()
                .success(true)
                .source("fallback")
                .householdId(household.getId())
                .flatNo(household.getFlatNo())
                .residentName(household.getOwnerName())
                .headline(headline)
                .consumptionSummary(summary)
                .potentialMonthlySavingsEstimate("Save ~1,500 L / \u20B9210 monthly")
                .tips(fallbackList)
                .trend(trend)
                .percentageChange(percentageChange)
                .currentMonthUsage(currentUsage)
                .previousMonthUsage(prevUsage)
                .averageMonthlyUsage(avgUsage)
                .generatedBy("Smart Rule Engine (Isolated Fallback)")
                .generatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")))
                .build();
    }
}
