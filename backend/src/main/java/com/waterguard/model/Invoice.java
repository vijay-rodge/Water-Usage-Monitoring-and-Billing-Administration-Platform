package com.waterguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "billing_cycle_id", nullable = false)
    private BillingCycle billingCycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 100)
    private String invoiceNumber;

    @Column(name = "total_consumption_liters", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalConsumptionLiters;

    @Column(name = "base_fixed_charge", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal baseFixedCharge = BigDecimal.ZERO;

    @Column(name = "tiered_metered_charge", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal tieredMeteredCharge = BigDecimal.ZERO;

    @Column(name = "tiered_breakdown_json", columnDefinition = "TEXT")
    private String tieredBreakdownJson;

    @Column(name = "apportioned_common_area_charge", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal apportionedCommonAreaCharge = BigDecimal.ZERO;

    @Column(name = "sewage_maintenance_charge", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal sewageMaintenanceCharge = BigDecimal.ZERO;

    @Column(name = "total_amount_due", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmountDue;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private String paymentStatus = "UNPAID";

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
