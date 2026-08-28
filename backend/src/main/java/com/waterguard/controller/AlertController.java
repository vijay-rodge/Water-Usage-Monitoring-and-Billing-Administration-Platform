package com.waterguard.controller;

import com.waterguard.model.Alert;
import com.waterguard.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AlertController {

    private final AlertRepository alertRepository;

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<Alert>> getHouseholdAlerts(@PathVariable Long householdId) {
        return ResponseEntity.ok(alertRepository.findByHouseholdIdOrderByCreatedAtDesc(householdId));
    }

    @GetMapping("/apartment/{apartmentId}")
    public ResponseEntity<List<Alert>> getApartmentAlerts(@PathVariable Long apartmentId) {
        return ResponseEntity.ok(alertRepository.findByApartmentIdOrderByCreatedAtDesc(apartmentId));
    }

    @PatchMapping("/{alertId}/read")
    public ResponseEntity<Alert> markAlertAsRead(@PathVariable Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found"));
        alert.setIsRead(true);
        return ResponseEntity.ok(alertRepository.save(alert));
    }

    @PatchMapping("/{alertId}/resolve")
    public ResponseEntity<Alert> markAlertAsResolved(@PathVariable Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found"));
        alert.setIsResolved(true);
        return ResponseEntity.ok(alertRepository.save(alert));
    }
}

