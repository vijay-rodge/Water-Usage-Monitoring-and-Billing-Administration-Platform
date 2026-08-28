package com.waterguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyTrendPoint {
        private String date;
        private BigDecimal liters;
        private Boolean isAnomaly;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResidentDashboardSummary {
        private Long householdId;
        private String flatNo;
        private String blockWing;
        private String residentName;
        private BigDecimal currentMonthConsumptionLiters;
        private BigDecimal previousMonthConsumptionLiters;
        private BigDecimal dailyAverageLiters;
        private BigDecimal estimatedCurrentBillAmount;
        private String currentTierName;
        private BigDecimal currentTierProgressPct;
        private Integer activeAnomalyAlertsCount;
        private BigDecimal waterEfficiencyScore;
        private List<DailyTrendPoint> dailyTrends;
        private List<BillingDto.TierBreakdownItem> estimatedTierBreakdown;
        private BillingDto.InvoiceResponse latestInvoice;
        private List<AlertDto> recentAlerts;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminDashboardSummary {
        private Long apartmentId;
        private String apartmentName;
        private Integer totalHouseholds;
        private Integer activeHouseholds;
        private BigDecimal totalCommunityConsumptionLiters;
        private BigDecimal totalBulkWaterPurchasedLiters;
        private BigDecimal totalBilledAmount;
        private BigDecimal totalCollectedAmount;
        private BigDecimal pendingCollectionAmount;
        private Integer unresolvedAnomaliesCount;
        private List<DailyTrendPoint> communityDailyTrends;
        private List<HouseholdWaterSummary> topConsumingHouseholds;
        private List<AlertDto> criticalAlerts;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HouseholdWaterSummary {
        private Long householdId;
        private String flatNo;
        private String ownerName;
        private BigDecimal monthlyConsumptionLiters;
        private BigDecimal estimatedCost;
        private Boolean hasAnomaly;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertDto {
        private Long id;
        private String title;
        private String message;
        private String alertType;
        private String severity;
        private Boolean isRead;
        private Boolean isResolved;
        private String createdAt;
    }
}
