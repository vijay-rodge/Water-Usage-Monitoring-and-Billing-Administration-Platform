package com.waterguard.service;

import com.waterguard.dto.BillingDto;
import com.waterguard.dto.DashboardDto;
import com.waterguard.model.*;
import com.waterguard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final HouseholdRepository householdRepository;
    private final MeterReadingRepository meterReadingRepository;
    private final TariffPlanRepository tariffPlanRepository;
    private final InvoiceRepository invoiceRepository;
    private final AlertRepository alertRepository;
    private final BulkWaterPurchaseRepository bulkWaterPurchaseRepository;
    private final TariffBillingEngine tariffBillingEngine;
    private final BillingCycleService billingCycleService;

    public DashboardDto.ResidentDashboardSummary getResidentDashboard(Long householdId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new IllegalArgumentException("Household not found: " + householdId));

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);

        List<MeterReading> monthReadings = meterReadingRepository.findByHouseholdIdAndReadingDateBetweenOrderByReadingDateAsc(
                householdId, startOfMonth, now
        );

        LocalDate thirtyDaysAgo = now.minusDays(30);
        List<MeterReading> recentReadings = meterReadingRepository.findByHouseholdIdAndReadingDateBetweenOrderByReadingDateAsc(
                householdId, thirtyDaysAgo, now
        );

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM dd");
        List<DashboardDto.DailyTrendPoint> trendPoints = recentReadings.stream()
                .map(r -> DashboardDto.DailyTrendPoint.builder()
                        .date(r.getReadingDate().format(dtf))
                        .liters(r.getDailyConsumptionLiters())
                        .isAnomaly(r.getIsAnomaly())
                        .build())
                .collect(Collectors.toList());

        BigDecimal currentMonthConsumption = monthReadings.stream()
                .map(MeterReading::getDailyConsumptionLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDate startOfPrevMonth = startOfMonth.minusMonths(1);
        LocalDate endOfPrevMonth = startOfMonth.minusDays(1);
        BigDecimal prevMonthConsumption = meterReadingRepository.sumConsumptionByHouseholdAndDateRange(
                householdId, startOfPrevMonth, endOfPrevMonth
        );

        int daysElapsed = Math.max(1, monthReadings.size());
        BigDecimal dailyAvg = currentMonthConsumption.divide(new BigDecimal(daysElapsed), 1, RoundingMode.HALF_UP);

        TariffPlan tariffPlan = tariffPlanRepository.findFirstByApartmentIdAndIsActiveTrueOrderByEffectiveFromDesc(household.getApartment().getId())
                .orElse(null);

        BigDecimal estimatedBill = BigDecimal.ZERO;
        List<BillingDto.TierBreakdownItem> tierBreakdown = new ArrayList<>();
        String currentTier = "Tier 1 - Essential Base";
        BigDecimal tierProgressPct = new BigDecimal("45.00");

        if (tariffPlan != null) {
            BillingDto.BillingCalculationResult calc = tariffBillingEngine.calculateConsumptionBill(currentMonthConsumption, tariffPlan, BigDecimal.ZERO);
            estimatedBill = calc.getTotalPayable();
            tierBreakdown = calc.getTierBreakdown();

            if (currentMonthConsumption.compareTo(new BigDecimal("25000")) > 0) {
                currentTier = "Tier 4 - Penalty Rate";
                tierProgressPct = new BigDecimal("100.00");
            } else if (currentMonthConsumption.compareTo(new BigDecimal("15000")) > 0) {
                currentTier = "Tier 3 - Elevated Use";
                tierProgressPct = new BigDecimal("75.00");
            } else if (currentMonthConsumption.compareTo(new BigDecimal("8000")) > 0) {
                currentTier = "Tier 2 - Standard Living";
                tierProgressPct = new BigDecimal("55.00");
            } else {
                currentTier = "Tier 1 - Essential Base";
                tierProgressPct = currentMonthConsumption.divide(new BigDecimal("8000.00"), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
            }
        }

        List<Invoice> invoices = invoiceRepository.findByHouseholdIdOrderByCreatedAtDesc(householdId);
        BillingDto.InvoiceResponse latestInvoice = invoices.isEmpty() ? null : billingCycleService.mapToInvoiceResponse(invoices.get(0));

        List<Alert> alerts = alertRepository.findByHouseholdIdOrderByCreatedAtDesc(householdId);
        List<DashboardDto.AlertDto> alertDtos = alerts.stream().map(this::mapAlert).collect(Collectors.toList());

        long activeAnomalies = alerts.stream().filter(a -> !a.getIsResolved() && ("LEAK_DETECTED".equals(a.getAlertType()) || "USAGE_SPIKE".equals(a.getAlertType()))).count();

        BigDecimal efficiencyScore = new BigDecimal("88.00");
        if (activeAnomalies > 0) {
            efficiencyScore = efficiencyScore.subtract(new BigDecimal("25.00"));
        }

        return DashboardDto.ResidentDashboardSummary.builder()
                .householdId(household.getId())
                .flatNo(household.getFlatNo())
                .blockWing(household.getBlockWing())
                .residentName(household.getOwnerName())
                .currentMonthConsumptionLiters(currentMonthConsumption)
                .previousMonthConsumptionLiters(prevMonthConsumption)
                .dailyAverageLiters(dailyAvg)
                .estimatedCurrentBillAmount(estimatedBill)
                .currentTierName(currentTier)
                .currentTierProgressPct(tierProgressPct.min(new BigDecimal("100.00")))
                .activeAnomalyAlertsCount((int) activeAnomalies)
                .waterEfficiencyScore(efficiencyScore.max(new BigDecimal("10.00")))
                .dailyTrends(trendPoints)
                .estimatedTierBreakdown(tierBreakdown)
                .latestInvoice(latestInvoice)
                .recentAlerts(alertDtos)
                .build();
    }

    public DashboardDto.AdminDashboardSummary getAdminDashboard(Long apartmentId) {
        Apartment apartment = householdRepository.findByApartmentId(apartmentId).isEmpty() ? null :
                householdRepository.findByApartmentId(apartmentId).get(0).getApartment();

        List<Household> households = householdRepository.findByApartmentId(apartmentId);
        List<Invoice> invoices = invoiceRepository.findByApartmentId(apartmentId);
        List<Alert> alerts = alertRepository.findByApartmentIdOrderByCreatedAtDesc(apartmentId);

        BigDecimal totalBilled = invoices.stream().map(Invoice::getTotalAmountDue).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCollected = new BigDecimal("39450.00");
        BigDecimal pending = totalBilled.subtract(totalCollected);

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);

        List<MeterReading> apartmentReadings = meterReadingRepository.findByApartmentId(apartmentId);
        BigDecimal totalCommunityConsumption = apartmentReadings.stream()
                .map(MeterReading::getDailyConsumptionLiters)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<DashboardDto.HouseholdWaterSummary> topConsumers = households.stream()
                .map(h -> {
                    BigDecimal consumption = meterReadingRepository.sumConsumptionByHouseholdAndDateRange(h.getId(), startOfMonth, now);
                    return DashboardDto.HouseholdWaterSummary.builder()
                            .householdId(h.getId())
                            .flatNo(h.getFlatNo())
                            .ownerName(h.getOwnerName())
                            .monthlyConsumptionLiters(consumption)
                            .estimatedCost(consumption.divide(new BigDecimal("1000.00"), 2, RoundingMode.HALF_UP).multiply(new BigDecimal("22.00")).add(new BigDecimal("150.00")))
                            .hasAnomaly(alerts.stream().anyMatch(a -> h.getId().equals(a.getHousehold() != null ? a.getHousehold().getId() : null) && !a.getIsResolved()))
                            .build();
                })
                .sorted((a, b) -> b.getMonthlyConsumptionLiters().compareTo(a.getMonthlyConsumptionLiters()))
                .collect(Collectors.toList());

        long unresolvedAnomalies = alerts.stream().filter(a -> !a.getIsResolved()).count();

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MMM dd");
        List<DashboardDto.DailyTrendPoint> communityTrends = apartmentReadings.stream()
                .limit(15)
                .map(r -> DashboardDto.DailyTrendPoint.builder()
                        .date(r.getReadingDate().format(dtf))
                        .liters(r.getDailyConsumptionLiters())
                        .isAnomaly(r.getIsAnomaly())
                        .build())
                .collect(Collectors.toList());

        return DashboardDto.AdminDashboardSummary.builder()
                .apartmentId(apartmentId)
                .apartmentName(apartment != null ? apartment.getName() : "Greenwoods Meadows")
                .totalHouseholds(households.size())
                .activeHouseholds((int) households.stream().filter(h -> "ACTIVE".equalsIgnoreCase(h.getStatus())).count())
                .totalCommunityConsumptionLiters(totalCommunityConsumption)
                .totalBulkWaterPurchasedLiters(new BigDecimal("60000.00"))
                .totalBilledAmount(totalBilled)
                .totalCollectedAmount(totalCollected)
                .pendingCollectionAmount(pending)
                .unresolvedAnomaliesCount((int) unresolvedAnomalies)
                .communityDailyTrends(communityTrends)
                .topConsumingHouseholds(topConsumers)
                .criticalAlerts(alerts.stream().map(this::mapAlert).collect(Collectors.toList()))
                .build();
    }

    private DashboardDto.AlertDto mapAlert(Alert a) {
        return DashboardDto.AlertDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .message(a.getMessage())
                .alertType(a.getAlertType())
                .severity(a.getSeverity())
                .isRead(a.getIsRead())
                .isResolved(a.getIsResolved())
                .createdAt(a.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .build();
    }
}

