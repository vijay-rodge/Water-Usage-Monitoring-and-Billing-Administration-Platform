package com.waterguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "meter_readings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeterReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @Column(name = "reading_date", nullable = false)
    private LocalDate readingDate;

    @Column(name = "previous_reading_liters", nullable = false, precision = 12, scale = 2)
    private BigDecimal previousReadingLiters;

    @Column(name = "current_reading_liters", nullable = false, precision = 12, scale = 2)
    private BigDecimal currentReadingLiters;

    @Column(name = "daily_consumption_liters", nullable = false, precision = 12, scale = 2)
    private BigDecimal dailyConsumptionLiters;

    @Column(name = "log_source", nullable = false, length = 30)
    @Builder.Default
    private String logSource = "MANUAL";

    @Column(name = "is_anomaly", nullable = false)
    @Builder.Default
    private Boolean isAnomaly = false;

    @Column(name = "anomaly_type", length = 50)
    private String anomalyType;

    @Column(name = "anomaly_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal anomalyScore = BigDecimal.ZERO;

    @Column(length = 255)
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by_user_id")
    private User recordedByUser;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
