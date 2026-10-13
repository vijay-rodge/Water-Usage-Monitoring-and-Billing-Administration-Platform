package com.waterguard.controller;

import com.waterguard.config.UserPrincipal;
import com.waterguard.dto.DashboardDto;
import com.waterguard.service.WaterTipsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class WaterTipsController {

    private final WaterTipsService waterTipsService;

    /**
     * Dedicated Endpoint: GET /api/resident/water-tips
     * Isolated Gemini-powered water-saving tips for the logged-in resident.
     */
    @GetMapping("/resident/water-tips")
    public ResponseEntity<DashboardDto.ResidentWaterTipsResponse> getResidentWaterTips(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Long householdId,
            @RequestParam(required = false, defaultValue = "false") boolean refresh
    ) {
        Long targetHouseholdId = resolveHouseholdId(principal, householdId);
        return ResponseEntity.ok(waterTipsService.getPersonalizedWaterTips(targetHouseholdId, refresh));
    }

    /**
     * Dedicated Endpoint: GET /api/dashboard/resident/{householdId}/water-tips
     */
    @GetMapping("/dashboard/resident/{householdId}/water-tips")
    public ResponseEntity<DashboardDto.ResidentWaterTipsResponse> getResidentWaterTipsByPath(
            @PathVariable Long householdId,
            @RequestParam(required = false, defaultValue = "false") boolean refresh
    ) {
        return ResponseEntity.ok(waterTipsService.getPersonalizedWaterTips(householdId, refresh));
    }

    private Long resolveHouseholdId(UserPrincipal principal, Long requestedHouseholdId) {
        if (requestedHouseholdId != null && requestedHouseholdId > 0) {
            return requestedHouseholdId;
        }
        if (principal != null && principal.getHouseholdId() != null) {
            return principal.getHouseholdId();
        }
        return 1L; // Default standard household
    }
}
