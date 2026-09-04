package com.waterguard.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class AuthDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {
        @JsonAlias({"communityName", "apartmentName", "societyName"})
        private String communityName;

        @JsonAlias({"societyEmail", "communityEmail", "officialEmail"})
        private String societyEmail;

        private String address;

        private Integer totalFlats;

        @JsonAlias({"adminName", "adminFullName", "fullName", "name", "residentName"})
        @NotBlank(message = "Full Name is required")
        private String fullName;

        @JsonAlias({"adminEmail", "email", "residentEmail"})
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;
        private String flatNo;
        private String wing;
        private String bhk;
        private Long apartmentId;
        private Long householdId;
        private String role; // "ADMIN" or "RESIDENT"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserSummary {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String approvalStatus;
        private Boolean isActive;
        private Long communityId;
        private String communityName;
        private Long householdId;
        private String flatNo;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AuthResponse {
        @Builder.Default
        private Boolean success = true;
        private String message;
        private String token;
        @Builder.Default
        private String tokenType = "Bearer";
        private Boolean pendingApproval;
        private UserSummary user;

        // Backward compatibility getters
        public Long getUserId() { return user != null ? user.getId() : null; }
        public String getEmail() { return user != null ? user.getEmail() : null; }
        public String getFullName() { return user != null ? user.getName() : null; }
        public String getRole() { return user != null ? user.getRole() : null; }
        public Long getApartmentId() { return user != null ? user.getCommunityId() : null; }
        public String getApartmentName() { return user != null ? user.getCommunityName() : null; }
        public Long getHouseholdId() { return user != null ? user.getHouseholdId() : null; }
        public String getFlatNo() { return user != null ? user.getFlatNo() : null; }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PendingResidentDto {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String flatNo;
        private String blockWing;
        private Long householdId;
        private Long apartmentId;
        private String apartmentName;
        private String approvalStatus;
        private LocalDateTime requestedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CommunityOptionDto {
        private Long id;
        private String name;
        private String code;
        private String address;
        private String city;
        private String societyEmail;
        private Integer totalFlats;
        private String adminName;
        private String adminEmail;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageResponse {
        @Builder.Default
        private Boolean success = true;
        private String message;
    }
}
