package com.waterguard.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;
        @NotBlank private String fullName;
        private String phone;
        private Long apartmentId;
        private Long householdId;
        private String role;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        @Builder.Default private String tokenType = "Bearer";
        private Long userId;
        private String email;
        private String fullName;
        private String role;
        private Long apartmentId;
        private String apartmentName;
        private Long householdId;
        private String flatNo;
    }
}

