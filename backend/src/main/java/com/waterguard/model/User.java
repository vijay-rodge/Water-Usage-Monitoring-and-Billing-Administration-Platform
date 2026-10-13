package com.waterguard.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(length = 50)
    private String phone;

    @Column(name = "billing_address", length = 255)
    private String billingAddress;

    @Column(name = "organization_name", length = 150)
    private String organizationName;

    @Column(nullable = false, length = 30)
    private String role; // ADMIN or RESIDENT

    @Column(name = "approval_status", length = 30)
    @Builder.Default
    private String approvalStatus = "APPROVED"; // APPROVED, PENDING, REJECTED

    @Column(name = "document_type", length = 50)
    private String documentType; // ELECTRICITY_BILL, RENTAL_AGREEMENT, SALE_DEED, GOVERNMENT_ID

    @Column(name = "document_name", length = 255)
    private String documentName;

    @Lob
    @Column(name = "document_data", columnDefinition = "TEXT")
    private String documentData;

    @Column(name = "document_uploaded_at")
    private LocalDateTime documentUploadedAt;

    @Column(name = "document_verification_status", length = 30)
    @Builder.Default
    private String documentVerificationStatus = "NOT_SUBMITTED"; // NOT_SUBMITTED, PENDING, VERIFIED, REJECTED

    @Column(name = "document_rejection_reason", length = 500)
    private String documentRejectionReason;

    @Column(name = "verified_by_admin_name", length = 150)
    private String verifiedByAdminName;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
