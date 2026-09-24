package com.waterguard.controller;

import com.waterguard.config.UserPrincipal;
import com.waterguard.dto.BillingDto;
import com.waterguard.dto.ChatDto;
import com.waterguard.dto.DashboardDto;
import com.waterguard.model.Apartment;
import com.waterguard.model.Household;
import com.waterguard.model.TariffPlan;
import com.waterguard.model.User;
import com.waterguard.repository.ApartmentRepository;
import com.waterguard.repository.HouseholdRepository;
import com.waterguard.repository.TariffPlanRepository;
import com.waterguard.repository.UserRepository;
import com.waterguard.service.DashboardService;
import com.waterguard.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;

@RestController
@RequestMapping("/chat")
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ChatAssistantController {

    private final GeminiService geminiService;
    private final com.waterguard.service.DashboardService dashboardService;
    private final UserRepository userRepository;
    private final HouseholdRepository householdRepository;
    private final ApartmentRepository apartmentRepository;
    private final TariffPlanRepository tariffPlanRepository;

    @Autowired
    public ChatAssistantController(
            GeminiService geminiService,
            com.waterguard.service.DashboardService dashboardService,
            UserRepository userRepository,
            HouseholdRepository householdRepository,
            ApartmentRepository apartmentRepository,
            TariffPlanRepository tariffPlanRepository
    ) {
        this.geminiService = geminiService;
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
        this.householdRepository = householdRepository;
        this.apartmentRepository = apartmentRepository;
        this.tariffPlanRepository = tariffPlanRepository;
    }

    @PostMapping("/assistant")
    public ResponseEntity<ChatDto.ChatResponse> chatWithAssistant(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody ChatDto.ChatRequest request,
            @RequestHeader(value = "X-Gemini-Api-Key", required = false) String headerApiKey
    ) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body(ChatDto.ChatResponse.builder()
                    .success(false)
                    .reply("Please provide a question or message.")
                    .build());
        }

        // Priority for API key: 1) request.apiKey, 2) X-Gemini-Api-Key header, 3) backend configured
        String apiKey = (request.getApiKey() != null && !request.getApiKey().isBlank())
                ? request.getApiKey().trim()
                : headerApiKey;

        // Resolve current user context
        User currentUser = resolveUser(principal, request.getClientContext());
        String systemPrompt = buildSystemPromptForUser(currentUser, request.getClientContext());

        String modelToUse = (request.getModel() != null && !request.getModel().isBlank())
                ? request.getModel().trim()
                : "gemini-1.5-flash";

        String aiReply = geminiService.generateAnswer(
                systemPrompt,
                request.getHistory(),
                request.getMessage(),
                apiKey,
                modelToUse
        );

        return ResponseEntity.ok(ChatDto.ChatResponse.builder()
                .success(true)
                .reply(aiReply)
                .modelUsed(modelToUse)
                .userName(currentUser != null ? currentUser.getFullName() : "Guest User")
                .userRole(currentUser != null ? currentUser.getRole() : "RESIDENT")
                .build());
    }

    private User resolveUser(UserPrincipal principal, Map<String, Object> clientContext) {
        if (principal != null && principal.getUserId() != null) {
            Optional<User> u = userRepository.findById(principal.getUserId());
            if (u.isPresent()) return u.get();
        }

        // If not authenticated via JWT, check clientContext email
        if (clientContext != null && clientContext.containsKey("email")) {
            String email = String.valueOf(clientContext.get("email")).trim().toLowerCase();
            Optional<User> u = userRepository.findByEmail(email);
            if (u.isPresent()) return u.get();
        }

        // Check if role is specified in clientContext (e.g. admin or resident)
        if (clientContext != null && "admin".equalsIgnoreCase(String.valueOf(clientContext.get("role")))) {
            return userRepository.findAll().stream()
                    .filter(u -> "ADMIN".equalsIgnoreCase(u.getRole()) || "ROLE_ADMIN".equalsIgnoreCase(u.getRole()))
                    .findFirst()
                    .orElse(null);
        }

        // Default to first resident
        return userRepository.findAll().stream()
                .filter(u -> !"ADMIN".equalsIgnoreCase(u.getRole()) && !"ROLE_ADMIN".equalsIgnoreCase(u.getRole()))
                .findFirst()
                .orElse(null);
    }

    private String buildSystemPromptForUser(User user, Map<String, Object> clientContext) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are AquaBot, the friendly, intelligent, and highly knowledgeable Smart Water AI Assistant on the AquaFlow platform.\n");
        sb.append("You specialize in digital water sub-meter telemetry, 4-tier conservation billing, anomaly leak detection, and society bulk water logistics.\n\n");

        if (user == null) {
            sb.append("Current Session: Guest / Unauthenticated Visitor.\n");
            sb.append("Encourage the user to sign in or register their residential community to see their actual real-time flat water metrics.\n");
            return sb.toString();
        }

        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole()) || "ROLE_ADMIN".equalsIgnoreCase(user.getRole());
        String userName = user.getFullName() != null ? user.getFullName() : user.getEmail();
        String communityName = user.getApartment() != null ? user.getApartment().getName() : "AquaFlow Community";

        if (isAdmin) {
            sb.append("=== LOGGED IN USER CONTEXT: COMMUNITY ADMINISTRATOR ===\n");
            sb.append("• Administrator Name: ").append(userName).append("\n");
            sb.append("• Official Email: ").append(user.getEmail()).append("\n");
            sb.append("• Community / Society: ").append(communityName).append("\n");

            if (user.getApartment() != null) {
                Apartment apt = user.getApartment();
                sb.append("• Society Code: ").append(apt.getCode()).append("\n");
                sb.append("• Total Flats Registered: ").append(apt.getTotalFlats()).append(" units\n");
                sb.append("• Society Address: ").append(apt.getAddress()).append(", ").append(apt.getCity()).append("\n");

                try {
                    DashboardDto.AdminDashboardSummary adminData = dashboardService.getAdminDashboard(apt.getId());
                    if (adminData != null) {
                        sb.append("\n--- LIVE COMMUNITY WATER TELEMETRY & FINANCIALS ---\n");
                        sb.append("• Total Sub-Meter Consumption This Month: ")
                                .append(adminData.getTotalCommunityConsumptionLiters()).append(" Liters\n");
                        sb.append("• External Bulk Tankers Inflow: ")
                                .append(adminData.getTotalBulkWaterPurchasedLiters()).append(" Liters\n");
                        sb.append("• Total Billed Revenue: ₹").append(adminData.getTotalBilledAmount()).append("\n");
                        sb.append("• Total Collected Revenue: ₹").append(adminData.getTotalCollectedAmount()).append("\n");
                        sb.append("• Pending Collection Dues: ₹").append(adminData.getPendingCollectionAmount()).append("\n");
                        sb.append("• Total Unresolved Leak/Anomaly Alerts: ")
                                .append(adminData.getUnresolvedAnomaliesCount()).append(" active alert(s)\n");

                        if (adminData.getTopConsumingHouseholds() != null && !adminData.getTopConsumingHouseholds().isEmpty()) {
                            sb.append("• Top Consuming Flats: ");
                            adminData.getTopConsumingHouseholds().stream().limit(3).forEach(h -> 
                                sb.append("Flat ").append(h.getFlatNo()).append(" (")
                                  .append(h.getMonthlyConsumptionLiters()).append("L, Anomaly: ")
                                  .append(h.getHasAnomaly() ? "YES" : "No").append("); ")
                            );
                            sb.append("\n");
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to attach admin dashboard metrics: {}", e.getMessage());
                }
            }

            sb.append("\n--- OPERATIONAL RULES & APPORTIONMENT ---\n");
            sb.append("• Bulk tanker water costs are apportioned across flats based on their carpet area (Sq.Ft).\n");
            sb.append("• Automatic night leak detection flags continuous trickles >50 L/hr between 2:00 AM and 5:00 AM.\n");
            sb.append("• Standard late fee is ₹50 per month after the 15-day grace period.\n");
            sb.append("\nINSTRUCTIONS FOR ADMIN INTERACTION:\n");
            sb.append("• Address ").append(userName).append(" with executive courtesy.\n");
            sb.append("• When asked about society water status, finances, leakage anomalies, or tankers, cite the exact numbers provided above.\n");
            sb.append("• Provide strategic recommendations to curb society-wide unaccounted water losses.\n");

        } else {
            // RESIDENT CONTEXT
            sb.append("=== LOGGED IN USER CONTEXT: APARTMENT RESIDENT ===\n");
            sb.append("• Resident Name: ").append(userName).append("\n");
            sb.append("• Registered Email: ").append(user.getEmail()).append("\n");
            sb.append("• Residential Society: ").append(communityName).append("\n");

            Household household = user.getHousehold();
            if (household != null) {
                sb.append("• Flat Number: ").append(household.getFlatNo()).append("\n");
                sb.append("• Block / Wing: ").append(household.getBlockWing() != null ? household.getBlockWing() : "Wing A").append("\n");
                sb.append("• Unit Configuration: ").append(household.getBhkType() != null ? household.getBhkType() : "2BHK").append("\n");
                sb.append("• Carpet Area: ").append(household.getCarpetAreaSqft()).append(" Sq.Ft\n");
                sb.append("• Household Occupants: ").append(household.getOccupancyCount()).append(" persons\n");
                sb.append("• Digital Sub-Meter Serial: ").append(household.getMeterSerialNo()).append("\n");

                try {
                    DashboardDto.ResidentDashboardSummary residentData = dashboardService.getResidentDashboard(household.getId());
                    if (residentData != null) {
                        sb.append("\n--- LIVE RESIDENT WATER METRICS & ESTIMATED BILL ---\n");
                        sb.append("• Current Month Consumption: ")
                                .append(residentData.getCurrentMonthConsumptionLiters()).append(" Liters\n");
                        sb.append("• Daily Average Draw: ")
                                .append(residentData.getDailyAverageLiters()).append(" Liters/day\n");
                        sb.append("• Current Active Tariff Tier: ")
                                .append(residentData.getCurrentTierName()).append(" (")
                                .append(residentData.getCurrentTierProgressPct()).append("% of tier limit)\n");
                        sb.append("• Estimated Current Month Water Bill: ₹")
                                .append(residentData.getEstimatedCurrentBillAmount()).append("\n");
                        sb.append("• Water Efficiency Score: ")
                                .append(residentData.getWaterEfficiencyScore()).append(" / 100\n");
                        sb.append("• Active Leak / Anomaly Alerts for this flat: ")
                                .append(residentData.getActiveAnomalyAlertsCount()).append("\n");

                        if (residentData.getLatestInvoice() != null) {
                            BillingDto.InvoiceResponse inv = residentData.getLatestInvoice();
                            sb.append("• Latest Issued Invoice: ").append(inv.getInvoiceNumber())
                                    .append(", Status: ").append(inv.getPaymentStatus())
                                    .append(", Amount Due: ₹").append(inv.getTotalAmountDue())
                                    .append(", Due Date: ").append(inv.getDueDate()).append("\n");
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to attach resident dashboard metrics: {}", e.getMessage());
                }
            } else {
                sb.append("• Flat: Unassigned (Awaiting Admin Allocation)\n");
            }

            sb.append("\n--- TARIFF SLABS & CHARGES (HOW BILL IS CALCULATED) ---\n");
            sb.append("• Fixed Water Supply Access Charge: ₹150.00 / month\n");
            sb.append("• Tier 1 (Base Allowance): ₹5.00 per 1,000 Liters (for first 1,000L)\n");
            sb.append("• Tier 2 (Excess Tier): ₹8.00 per 1,000 Liters (beyond 1,000L)\n");
            sb.append("• STP Sewage Maintenance: Standard fixed contribution\n");
            sb.append("• Shared Tanker Water: Distributed strictly according to flat Carpet Area\n");
            sb.append("\nINSTRUCTIONS FOR RESIDENT INTERACTION:\n");
            sb.append("• Address ").append(userName).append(" warmly and personally.\n");
            sb.append("• If the resident asks about their bill, quote their Flat ").append(household != null ? household.getFlatNo() : "").append(" metrics and explain the breakdown.\n");
            sb.append("• If they ask about saving water, give concrete tips tailored to their usage (e.g. aerators, dual-flush cisterns, checking flapper valves).\n");
        }

        sb.append("\nGENERAL GUIDELINES:\n");
        sb.append("• Format answers in clean, readable Markdown (bullet points, bold highlights, concise paragraphs).\n");
        sb.append("• Keep answers helpful, accurate, and under 250 words unless detailed explanation is requested.\n");
        sb.append("• Never make up arbitrary billing numbers; always refer to the live metrics provided above.\n");

        return sb.toString();
    }
}
