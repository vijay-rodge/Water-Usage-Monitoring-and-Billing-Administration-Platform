package com.waterguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tariff_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TariffPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @Column(name = "plan_name", nullable = false, length = 100)
    private String planName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "base_fixed_charge", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal baseFixedCharge = new BigDecimal("150.00");

    @Column(name = "sewage_maintenance_pct", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal sewageMaintenancePct = new BigDecimal("10.00");

    @Column(name = "bulk_purchase_markup_pct", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal bulkPurchaseMarkupPct = new BigDecimal("5.00");

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @OneToMany(mappedBy = "tariffPlan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("tierLevel ASC")
    @Builder.Default
    private List<TariffTier> tiers = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

