package com.waterguard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class BillingDto {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TierBreakdownItem {
        private String tierName;
        private Integer tierLevel;
        private BigDecimal consumedLiters;
        private BigDecimal ratePer1000Liters;
        private BigDecimal cost;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillingCalculationResult {
        private Long householdId;
        private String flatNo;
        private BigDecimal totalConsumptionLiters;
        private BigDecimal baseFixedCharge;
        private BigDecimal tieredMeteredCharge;
        private List<TierBreakdownItem> tierBreakdown;
        private BigDecimal apportionedCommonAreaCharge;
        private BigDecimal sewageMaintenanceCharge;
        private BigDecimal totalPayable;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateCycleRequest {
        @NotNull private Long apartmentId;
        @NotBlank private String cycleName;
        @NotNull private LocalDate startDate;
        @NotNull private LocalDate endDate;
        @NotNull private LocalDate dueDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceResponse {
        private Long id;
        private Long billingCycleId;
        private String cycleName;
        private Long householdId;
        private String flatNo;
        private String blockWing;
        private String ownerName;
        private String ownerEmail;
        private String invoiceNumber;
        private BigDecimal totalConsumptionLiters;
        private BigDecimal baseFixedCharge;
        private BigDecimal tieredMeteredCharge;
        private List<TierBreakdownItem> tierBreakdown;
        private BigDecimal apportionedCommonAreaCharge;
        private BigDecimal sewageMaintenanceCharge;
        private BigDecimal totalAmountDue;
        private LocalDate dueDate;
        private String paymentStatus;
        private LocalDateTime paymentDate;
        private String paymentReference;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentRecordRequest {
        @NotBlank private String paymentReference;
    }
}
