package com.waterguard.controller;

import com.waterguard.dto.DashboardDto;
import com.waterguard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resident/{householdId}")
    public ResponseEntity<DashboardDto.ResidentDashboardSummary> getResidentDashboard(@PathVariable Long householdId) {
        return ResponseEntity.ok(dashboardService.getResidentDashboard(householdId));
    }

    @GetMapping("/admin/{apartmentId}")
    public ResponseEntity<DashboardDto.AdminDashboardSummary> getAdminDashboard(@PathVariable Long apartmentId) {
        return ResponseEntity.ok(dashboardService.getAdminDashboard(apartmentId));
    }
}
