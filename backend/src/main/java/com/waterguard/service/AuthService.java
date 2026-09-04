package com.waterguard.service;

import com.waterguard.config.JwtUtils;
import com.waterguard.dto.AuthDto;
import com.waterguard.model.Alert;
import com.waterguard.model.Apartment;
import com.waterguard.model.Household;
import com.waterguard.model.User;
import com.waterguard.repository.AlertRepository;
import com.waterguard.repository.ApartmentRepository;
import com.waterguard.repository.HouseholdRepository;
import com.waterguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;
    private final HouseholdRepository householdRepository;
    private final AlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional(readOnly = true)
    public AuthDto.AuthResponse authenticateUser(AuthDto.LoginRequest loginRequest) {
        String email = loginRequest.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Check Resident Approval Status
        String approval = user.getApprovalStatus() != null ? user.getApprovalStatus() : "APPROVED";
        if ("PENDING".equalsIgnoreCase(approval) || Boolean.FALSE.equals(user.getIsActive())) {
            String flatInfo = user.getHousehold() != null ? " for Flat " + user.getHousehold().getFlatNo() : "";
            throw new BadCredentialsException("Your registration request" + flatInfo + " is pending approval from your community administrator. You can log in once approved.");
        }

        if ("REJECTED".equalsIgnoreCase(approval)) {
            throw new BadCredentialsException("Your registration request was declined by the community administrator. Please contact your society office.");
        }

        Long communityId = user.getApartment() != null ? user.getApartment().getId() : null;
        String role = user.getRole() != null ? user.getRole().replace("ROLE_", "") : "RESIDENT";
        String jwt = jwtUtils.generateJwtToken(user.getId(), user.getEmail(), communityId, role);

        return AuthDto.AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .token(jwt)
                .user(buildUserSummary(user))
                .build();
    }

    @Transactional(rollbackFor = Exception.class)
    public AuthDto.AuthResponse registerUser(AuthDto.RegisterRequest registerRequest) {
        String email = registerRequest.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered: " + email);
        }

        Apartment apartment = null;
        String communityName = registerRequest.getCommunityName();
        boolean isCommunityOnboarding = communityName != null && !communityName.isBlank();

        if (isCommunityOnboarding) {
            // 1. UNIQUE ADMIN PER COMMUNITY RULE
            // Check if community with same name already exists
            List<Apartment> existing = apartmentRepository.findAll().stream()
                    .filter(a -> a.getName().equalsIgnoreCase(communityName.trim()))
                    .toList();

            if (!existing.isEmpty()) {
                Apartment existingApt = existing.get(0);
                boolean hasAdmin = userRepository.existsByApartmentIdAndRole(existingApt.getId(), "ADMIN")
                        || userRepository.existsByApartmentIdAndRole(existingApt.getId(), "ROLE_ADMIN");
                if (hasAdmin) {
                    throw new IllegalArgumentException("Community \"" + communityName + "\" is already registered and has a designated administrator.");
                }
                apartment = existingApt;
            } else {
                // Create New Community
                String aptCode = "JS-" + communityName.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
                if (aptCode.length() > 16) aptCode = aptCode.substring(0, 16);
                aptCode += "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

                apartment = Apartment.builder()
                        .name(communityName.trim())
                        .code(aptCode)
                        .societyEmail(registerRequest.getSocietyEmail() != null ? registerRequest.getSocietyEmail().trim().toLowerCase() : null)
                        .address(registerRequest.getAddress() != null ? registerRequest.getAddress() : "Sector 4, Bangalore")
                        .city(registerRequest.getAddress() != null ? registerRequest.getAddress() : "Bengaluru")
                        .state("Karnataka")
                        .postalCode("560001")
                        .totalFlats(registerRequest.getTotalFlats() != null ? registerRequest.getTotalFlats() : 24)
                        .commonAreaSqft(new BigDecimal("15000.00"))
                        .build();

                apartment = apartmentRepository.save(apartment);
                log.info("Created new community: ID={}, Name={}, SocietyEmail={}", apartment.getId(), apartment.getName(), apartment.getSocietyEmail());
            }

            // Create Unique Admin for Community
            User adminUser = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                    .fullName(registerRequest.getFullName())
                    .phone(registerRequest.getPhone())
                    .apartment(apartment)
                    .household(null)
                    .role("ADMIN")
                    .approvalStatus("APPROVED")
                    .isActive(true)
                    .build();

            adminUser = userRepository.save(adminUser);
            log.info("Created Community Admin: ID={}, Email={}, Community={}", adminUser.getId(), adminUser.getEmail(), apartment.getName());

            String jwt = jwtUtils.generateJwtToken(adminUser.getId(), adminUser.getEmail(), apartment.getId(), "ADMIN");

            return AuthDto.AuthResponse.builder()
                    .success(true)
                    .message("Community and Administrator registered successfully")
                    .token(jwt)
                    .pendingApproval(false)
                    .user(buildUserSummary(adminUser))
                    .build();

        } else {
            // =========================================================================
            // 2. RESIDENT ONBOARDING WITH APPROVAL WORKFLOW
            // =========================================================================
            if (registerRequest.getApartmentId() != null) {
                apartment = apartmentRepository.findById(registerRequest.getApartmentId()).orElse(null);
            }
            if (apartment == null) {
                apartment = apartmentRepository.findAll().stream().findFirst().orElse(null);
            }

            if (apartment == null) {
                throw new IllegalArgumentException("No active residential community found to register in. Please onboard a community first.");
            }

            String flatNo = registerRequest.getFlatNo() != null && !registerRequest.getFlatNo().isBlank() 
                    ? registerRequest.getFlatNo().trim().toUpperCase() 
                    : "A-101";

            final Apartment targetApt = apartment;
            Household household = householdRepository.findByApartmentIdAndFlatNo(targetApt.getId(), flatNo)
                    .orElseGet(() -> {
                        Household h = Household.builder()
                                .apartment(targetApt)
                                .flatNo(flatNo)
                                .blockWing(registerRequest.getWing() != null ? registerRequest.getWing() : "Wing A")
                                .floorNo(1)
                                .bhkType(registerRequest.getBhk() != null ? registerRequest.getBhk() : "2BHK")
                                .carpetAreaSqft(new BigDecimal("1200.00"))
                                .occupancyCount(3)
                                .meterSerialNo("WM-JS-" + flatNo.replace("-", "") + "-" + UUID.randomUUID().toString().substring(0, 4))
                                .initialMeterReading(new BigDecimal("10000.00"))
                                .ownerName(registerRequest.getFullName())
                                .ownerEmail(email)
                                .ownerPhone(registerRequest.getPhone())
                                .status("PENDING")
                                .build();
                        return householdRepository.save(h);
                    });

            // Create Resident with PENDING status (Needs Admin Approval)
            User resident = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                    .fullName(registerRequest.getFullName())
                    .phone(registerRequest.getPhone())
                    .apartment(targetApt)
                    .household(household)
                    .role("RESIDENT")
                    .approvalStatus("PENDING")
                    .isActive(false) // Inactive until Community Admin approves!
                    .build();

            resident = userRepository.save(resident);
            log.info("Created Resident Registration Request: ID={}, Email={}, Flat={}, Status=PENDING", resident.getId(), resident.getEmail(), flatNo);

            // Notify Community Admin via Alert
            User admin = userRepository.findByApartmentIdAndRole(targetApt.getId(), "ADMIN")
                    .or(() -> userRepository.findByApartmentIdAndRole(targetApt.getId(), "ROLE_ADMIN"))
                    .orElse(null);

            Alert approvalAlert = Alert.builder()
                    .apartment(targetApt)
                    .household(household)
                    .user(admin)
                    .title("New Resident Registration Request — Flat " + flatNo)
                    .message("Resident " + resident.getFullName() + " (" + resident.getEmail() + ") registered for Flat " + flatNo + ". Please review and approve.")
                    .alertType("RESIDENT_APPROVAL_REQUEST")
                    .severity("MEDIUM")
                    .isRead(false)
                    .isResolved(false)
                    .build();

            alertRepository.save(approvalAlert);

            return AuthDto.AuthResponse.builder()
                    .success(true)
                    .pendingApproval(true)
                    .message("Registration request submitted for Flat " + flatNo + "! Your community administrator (" + (admin != null ? admin.getFullName() : "RWA Secretary") + ") will review and approve your registration.")
                    .user(buildUserSummary(resident))
                    .build();
        }
    }

    // =========================================================================
    // ADMIN APPROVAL WORKFLOW METHODS (Community Data Isolation Enforced)
    // =========================================================================

    @Transactional
    public AuthDto.UserSummary approveResident(Long residentId, Long adminCommunityId) {
        User resident = userRepository.findById(residentId)
                .orElseThrow(() -> new IllegalArgumentException("Resident record not found with ID: " + residentId));

        // Community Data Isolation Check
        if (resident.getApartment() == null || !resident.getApartment().getId().equals(adminCommunityId)) {
            throw new SecurityException("Unauthorized: You can only approve residents belonging to your own community.");
        }

        resident.setApprovalStatus("APPROVED");
        resident.setIsActive(true);
        resident.setUpdatedAt(LocalDateTime.now());
        userRepository.save(resident);

        if (resident.getHousehold() != null) {
            resident.getHousehold().setStatus("ACTIVE");
            householdRepository.save(resident.getHousehold());
        }

        // Create approval confirmation alert
        Alert notification = Alert.builder()
                .apartment(resident.getApartment())
                .household(resident.getHousehold())
                .user(resident)
                .title("Flat Registration Approved")
                .message("Your registration for Flat " + (resident.getHousehold() != null ? resident.getHousehold().getFlatNo() : "") + " has been approved by your community administrator. You can now log in.")
                .alertType("SYSTEM_ANNOUNCEMENT")
                .severity("INFO")
                .isRead(false)
                .isResolved(false)
                .build();
        alertRepository.save(notification);

        log.info("Resident approved by Admin: ID={}, Email={}", resident.getId(), resident.getEmail());
        return buildUserSummary(resident);
    }

    @Transactional
    public AuthDto.MessageResponse rejectResident(Long residentId, Long adminCommunityId, String reason) {
        User resident = userRepository.findById(residentId)
                .orElseThrow(() -> new IllegalArgumentException("Resident record not found with ID: " + residentId));

        if (resident.getApartment() == null || !resident.getApartment().getId().equals(adminCommunityId)) {
            throw new SecurityException("Unauthorized: You can only decline residents belonging to your own community.");
        }

        resident.setApprovalStatus("REJECTED");
        resident.setIsActive(false);
        resident.setUpdatedAt(LocalDateTime.now());
        userRepository.save(resident);

        log.info("Resident registration declined by Admin: ID={}, Reason={}", resident.getId(), reason);
        return AuthDto.MessageResponse.builder()
                .success(true)
                .message("Resident registration request for " + resident.getFullName() + " was declined.")
                .build();
    }

    @Transactional(readOnly = true)
    public List<AuthDto.PendingResidentDto> getPendingResidents(Long adminCommunityId) {
        List<User> pendingUsers = userRepository.findByApartmentIdAndApprovalStatus(adminCommunityId, "PENDING");

        return pendingUsers.stream().map(u -> AuthDto.PendingResidentDto.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .flatNo(u.getHousehold() != null ? u.getHousehold().getFlatNo() : "N/A")
                .blockWing(u.getHousehold() != null ? u.getHousehold().getBlockWing() : "Wing A")
                .householdId(u.getHousehold() != null ? u.getHousehold().getId() : null)
                .apartmentId(u.getApartment() != null ? u.getApartment().getId() : null)
                .apartmentName(u.getApartment() != null ? u.getApartment().getName() : "")
                .approvalStatus(u.getApprovalStatus())
                .requestedAt(u.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuthDto.CommunityOptionDto> getRegisteredCommunities() {
        return apartmentRepository.findAll().stream().map(apt -> {
            User admin = userRepository.findByApartmentIdAndRole(apt.getId(), "ADMIN")
                    .or(() -> userRepository.findByApartmentIdAndRole(apt.getId(), "ROLE_ADMIN"))
                    .orElse(null);

            return AuthDto.CommunityOptionDto.builder()
                    .id(apt.getId())
                    .name(apt.getName())
                    .code(apt.getCode())
                    .address(apt.getAddress())
                    .city(apt.getCity() != null ? apt.getCity() : "Bengaluru")
                    .societyEmail(apt.getSocietyEmail())
                    .totalFlats(apt.getTotalFlats())
                    .adminName(admin != null ? admin.getFullName() : "Designated Secretary")
                    .adminEmail(admin != null ? admin.getEmail() : apt.getSocietyEmail())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AuthDto.UserSummary getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return buildUserSummary(user);
    }

    public AuthDto.UserSummary buildUserSummary(User user) {
        Long communityId = user.getApartment() != null ? user.getApartment().getId() : null;
        String communityName = user.getApartment() != null ? user.getApartment().getName() : null;
        Long householdId = user.getHousehold() != null ? user.getHousehold().getId() : null;
        String flatNo = user.getHousehold() != null ? user.getHousehold().getFlatNo() : null;
        String role = user.getRole() != null ? user.getRole().replace("ROLE_", "") : "RESIDENT";

        return AuthDto.UserSummary.builder()
                .id(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .role(role)
                .approvalStatus(user.getApprovalStatus() != null ? user.getApprovalStatus() : "APPROVED")
                .isActive(user.getIsActive() != null ? user.getIsActive() : true)
                .communityId(communityId)
                .communityName(communityName)
                .householdId(householdId)
                .flatNo(flatNo)
                .build();
    }
}
