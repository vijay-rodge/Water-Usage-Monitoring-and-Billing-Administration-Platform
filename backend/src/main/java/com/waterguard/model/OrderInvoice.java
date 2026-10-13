package com.waterguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 100)
    private String invoiceNumber;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private WaterOrder order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "invoice_date", nullable = false)
    @Builder.Default
    private LocalDate invoiceDate = LocalDate.now();

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "discount", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "tax", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(name = "delivery_charge", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal deliveryCharge = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "customer_email", nullable = false, length = 150)
    private String customerEmail;

    @Column(name = "pdf_reference", length = 255)
    private String pdfReference;

    @Column(name = "email_sent", nullable = false)
    @Builder.Default
    private Boolean emailSent = false;

    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;

    @Column(name = "email_error", columnDefinition = "TEXT")
    private String emailError;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
