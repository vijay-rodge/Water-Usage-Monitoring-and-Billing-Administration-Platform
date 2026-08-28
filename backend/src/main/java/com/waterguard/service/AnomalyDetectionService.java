package com.waterguard.service;

import com.waterguard.model.MeterReading;
import com.waterguard.repository.MeterReadingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnomalyDetectionService {

    private final MeterReadingRepository meterReadingRepository;

    public static class AnomalyResult {
        public boolean isAnomaly;
        public String anomalyType;
        public BigDecimal anomalyScore;
        public String remarks;

        public AnomalyResult(boolean isAnomaly, String anomalyType, BigDecimal anomalyScore, String remarks) {
            this.isAnomaly = isAnomaly;
            this.anomalyType = anomalyType;
            this.anomalyScore = anomalyScore;
            this.remarks = remarks;
        }
    }

    public AnomalyResult evaluateReading(Long householdId, LocalDate readingDate, BigDecimal consumptionLiters, BigDecimal previousReading, BigDecimal currentReading) {
        if (currentReading.compareTo(previousReading) < 0) {
            return new AnomalyResult(true, "METER_BACKWARD", new BigDecimal("100.00"), "Current reading is lower than previous meter reading. Potential meter reset or tampering.");
        }

        if (consumptionLiters.compareTo(new BigDecimal("3000.00")) >= 0) {
            return new AnomalyResult(true, "ABNORMAL_SPIKE", new BigDecimal("95.00"), "Massive water consumption spike detected exceeding 3,000 Liters in a single day.");
        }

        LocalDate startDate = readingDate.minusDays(14);
        LocalDate endDate = readingDate.minusDays(1);
        List<MeterReading> historical = meterReadingRepository.findByHouseholdIdAndReadingDateBetweenOrderByReadingDateAsc(householdId, startDate, endDate);

        if (historical != null && historical.size() >= 3) {
            BigDecimal sum = historical.stream()
                    .map(MeterReading::getDailyConsumptionLiters)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal avg = sum.divide(new BigDecimal(historical.size()), 2, RoundingMode.HALF_UP);

            if (avg.compareTo(new BigDecimal("50.00")) > 0) {
                BigDecimal ratio = consumptionLiters.divide(avg, 2, RoundingMode.HALF_UP);

                if (ratio.compareTo(new BigDecimal("2.20")) >= 0) {
                    BigDecimal score = ratio.multiply(new BigDecimal("35.00")).min(new BigDecimal("95.00"));
                    return new AnomalyResult(true, "LEAK_SUSPECTED", score, 
                            String.format("Consumption (%.0f L) is %.1fx higher than the 14-day average (%.0f L). Suspected plumbing leak.", 
                                    consumptionLiters.doubleValue(), ratio.doubleValue(), avg.doubleValue()));
                }
            }
        }

        return new AnomalyResult(false, null, BigDecimal.ZERO, "Normal consumption pattern.");
    }
}

