package com.waterguard.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class MeterReadingDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReadingSubmitRequest {
        @NotNull private Long householdId;
        @NotNull private LocalDate readingDate;
        @NotNull @PositiveOrZero private BigDecimal currentReadingLiters;
        private String remarks;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReadingResponse {
        private Long id;
        private Long householdId;
        private String flatNo;
        private LocalDate readingDate;
        private BigDecimal previousReadingLiters;
        private BigDecimal currentReadingLiters;
        private BigDecimal dailyConsumptionLiters;
        private String logSource;
        private Boolean isAnomaly;
        private String anomalyType;
        private BigDecimal anomalyScore;
        private String remarks;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CSVRowParsed {
        private String flatNo;
        private String meterSerialNo;
        private LocalDate readingDate;
        private BigDecimal currentReadingLiters;
        private BigDecimal dailyConsumptionLiters;
        private Boolean isAnomaly;
        private String anomalyReason;
        private Boolean isValid;
        private String errorMessage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulkUploadResult {
        private Integer totalProcessed;
        private Integer successCount;
        private Integer errorCount;
        private Integer anomaliesDetected;
        private List<CSVRowParsed> rows;
    }
}

