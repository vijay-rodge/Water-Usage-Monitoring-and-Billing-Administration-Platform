package com.waterguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "households")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Household {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @Column(name = "flat_no", nullable = false, length = 50)
    private String flatNo;

    @Column(name = "block_wing", nullable = false, length = 50)
    private String blockWing;

    @Column(name = "floor_no", nullable = false)
    private Integer floorNo;

    @Column(name = "bhk_type", nullable = false, length = 20)
    private String bhkType;

    @Column(name = "carpet_area_sqft", nullable = false, precision = 10, scale = 2)
    private BigDecimal carpetAreaSqft;

    @Column(name = "occupancy_count", nullable = false)
    @Builder.Default
    private Integer occupancyCount = 2;

    @Column(name = "meter_serial_no", nullable = false, unique = true, length = 100)
    private String meterSerialNo;

    @Column(name = "initial_meter_reading", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal initialMeterReading = BigDecimal.ZERO;

    @Column(name = "owner_name", nullable = false, length = 150)
    private String ownerName;

    @Column(name = "owner_email", nullable = false, length = 150)
    private String ownerEmail;

    @Column(name = "owner_phone", length = 50)
    private String ownerPhone;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

