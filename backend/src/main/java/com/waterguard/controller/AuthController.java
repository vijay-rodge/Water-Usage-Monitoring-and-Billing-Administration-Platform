package com.waterguard.controller;

import com.waterguard.config.JwtUtils;
import com.waterguard.config.UserPrincipal;
import com.waterguard.dto.AuthDto;
import com.waterguard.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;

    @GetMapping("/communities")
    public ResponseEntity<List<AuthDto.CommunityOptionDto>> getRegisteredCommunities() {
        return ResponseEntity.ok(authService.getRegisteredCommunities());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(
            @Valid @RequestBody AuthDto.LoginRequest loginRequest,
            HttpServletResponse response
    ) {
        AuthDto.AuthResponse authResponse = authService.authenticateUser(loginRequest);

        // Set JWT in secure HttpOnly cookie
        ResponseCookie cookie = jwtUtils.createJwtCookie(authResponse.getToken());
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(
            @Valid @RequestBody AuthDto.RegisterRequest registerRequest,
            HttpServletResponse response
    ) {
        AuthDto.AuthResponse authResponse = authService.registerUser(registerRequest);

        // Only set auth cookie if user is immediately active (i.e. Community Admin)
        if (Boolean.FALSE.equals(authResponse.getPendingApproval()) && authResponse.getToken() != null) {
            ResponseCookie cookie = jwtUtils.createJwtCookie(authResponse.getToken());
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    AuthDto.MessageResponse.builder()
                            .success(false)
                            .message("Not authenticated")
                            .build()
            );
        }

        AuthDto.UserSummary userSummary = authService.getCurrentUser(principal.getUsername());
        return ResponseEntity.ok(userSummary);
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthDto.MessageResponse> logout(HttpServletResponse response) {
        ResponseCookie cleanCookie = jwtUtils.createCleanJwtCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, cleanCookie.toString());

        return ResponseEntity.ok(
                AuthDto.MessageResponse.builder()
                        .success(true)
                        .message("Logged out successfully")
                        .build()
        );
    }

    // =========================================================================
    // COMMUNITY ADMIN APPROVAL ENDPOINTS
    // =========================================================================

    @GetMapping("/pending-residents")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<AuthDto.PendingResidentDto>> getPendingResidents(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long communityId = principal.getCommunityId() != null ? principal.getCommunityId() : 1L;
        List<AuthDto.PendingResidentDto> pending = authService.getPendingResidents(communityId);
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/approve-resident/{residentId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<AuthDto.UserSummary> approveResident(
            @PathVariable Long residentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long communityId = principal.getCommunityId() != null ? principal.getCommunityId() : 1L;
        AuthDto.UserSummary approved = authService.approveResident(residentId, communityId);
        return ResponseEntity.ok(approved);
    }

    @PostMapping("/reject-resident/{residentId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<AuthDto.MessageResponse> rejectResident(
            @PathVariable Long residentId,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long communityId = principal.getCommunityId() != null ? principal.getCommunityId() : 1L;
        String reason = body != null && body.containsKey("reason") ? body.get("reason") : "Declined by Administrator";
        AuthDto.MessageResponse response = authService.rejectResident(residentId, communityId, reason);
        return ResponseEntity.ok(response);
    }
}
