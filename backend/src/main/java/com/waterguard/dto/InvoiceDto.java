package com.waterguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class InvoiceDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateWaterOrderRequest {
        private Long targetUserId; // Specific resident user ID if admin creates for resident
        private String residentEmail; // Recipient resident email
        private String residentName; // Recipient resident name
        private String residentPhone; // Recipient resident phone
        private String flatNo; // Resident flat number
        private String waterType; // e.g. "Potable Tanker Water", "Reverse Osmosis (RO)", "Standard Commercial Tanker"
        private BigDecimal quantityLiters;
        private String deliveryAddress;
        private String customerNotes;
        private String paymentMethod; // UPI, Net Banking, Card
        private String paymentReference;
        private String billingAddress;
        private String organizationName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderInvoiceResponse {
        private Long id;
        private String invoiceNumber;
        private Long orderId;
        private String orderNumber;
        private Long userId;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String billingAddress;
        private String organizationName;
        private LocalDate invoiceDate;
        private String waterType;
        private BigDecimal quantityLiters;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
        private BigDecimal discount;
        private BigDecimal tax;
        private BigDecimal deliveryCharge;
        private BigDecimal totalAmount;
        private String paymentStatus;
        private String paymentReference;
        private String paymentMethod;
        private String pdfReference;
        private Boolean emailSent;
        private LocalDateTime emailSentAt;
        private String emailError;
        private LocalDateTime createdAt;
    }
}
