package com.waterguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tariff_tiers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TariffTier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tariff_plan_id", nullable = false)
    private TariffPlan tariffPlan;

    @Column(name = "tier_level", nullable = false)
    private Integer tierLevel;

    @Column(name = "tier_name", nullable = false, length = 50)
    private String tierName;

    @Column(name = "min_liters", nullable = false, precision = 12, scale = 2)
    private BigDecimal minLiters;

    @Column(name = "max_liters", precision = 12, scale = 2)
    private BigDecimal maxLiters;

    @Column(name = "rate_per_1000_liters", nullable = false, precision = 10, scale = 2)
    private BigDecimal ratePer1000Liters;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

