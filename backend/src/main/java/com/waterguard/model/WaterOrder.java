package com.waterguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaterOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    @Column(name = "order_date", nullable = false)
    @Builder.Default
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "water_type", nullable = false, length = 100)
    private String waterType;

    @Column(name = "quantity_liters", nullable = false, precision = 12, scale = 2)
    private BigDecimal quantityLiters;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "discount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "tax", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(name = "delivery_charges", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal deliveryCharges = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private String paymentStatus = "PAID";

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "payment_method", length = 50)
    @Builder.Default
    private String paymentMethod = "UPI";

    @Column(name = "delivery_address", length = 255)
    private String deliveryAddress;

    @Column(name = "customer_notes", length = 255)
    private String customerNotes;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
