package com.waterguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "apartments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "society_email", length = 150)
    private String societyEmail;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;

    @Column(name = "total_flats", nullable = false)
    @Builder.Default
    private Integer totalFlats = 0;

    @Column(name = "common_area_sqft", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal commonAreaSqft = BigDecimal.ZERO;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
