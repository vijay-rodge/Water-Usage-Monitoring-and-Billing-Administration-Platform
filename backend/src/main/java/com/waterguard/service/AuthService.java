package com.waterguard.service;

import com.waterguard.config.JwtUtils;
import com.waterguard.dto.AuthDto;
import com.waterguard.model.Apartment;
import com.waterguard.model.Household;
import com.waterguard.model.User;
import com.waterguard.repository.ApartmentRepository;
import com.waterguard.repository.HouseholdRepository;
import com.waterguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;
    private final HouseholdRepository householdRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthDto.AuthResponse authenticateUser(AuthDto.LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + loginRequest.getEmail()));

        return AuthDto.AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .apartmentId(user.getApartment() != null ? user.getApartment().getId() : null)
                .apartmentName(user.getApartment() != null ? user.getApartment().getName() : null)
                .householdId(user.getHousehold() != null ? user.getHousehold().getId() : null)
                .flatNo(user.getHousehold() != null ? user.getHousehold().getFlatNo() : null)
                .build();
    }

    public AuthDto.AuthResponse registerUser(AuthDto.RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already in use!");
        }

        Apartment apartment = null;
        if (registerRequest.getApartmentId() != null) {
            apartment = apartmentRepository.findById(registerRequest.getApartmentId()).orElse(null);
        }

        Household household = null;
        if (registerRequest.getHouseholdId() != null) {
            household = householdRepository.findById(registerRequest.getHouseholdId()).orElse(null);
        }

        String role = registerRequest.getRole() != null ? registerRequest.getRole() : "ROLE_RESIDENT";

        User user = User.builder()
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .phone(registerRequest.getPhone())
                .apartment(apartment)
                .household(household)
                .role(role)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        String jwt = jwtUtils.generateTokenFromEmail(user.getEmail());

        return AuthDto.AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .apartmentId(apartment != null ? apartment.getId() : null)
                .apartmentName(apartment != null ? apartment.getName() : null)
                .householdId(household != null ? household.getId() : null)
                .flatNo(household != null ? household.getFlatNo() : null)
                .build();
    }
}

