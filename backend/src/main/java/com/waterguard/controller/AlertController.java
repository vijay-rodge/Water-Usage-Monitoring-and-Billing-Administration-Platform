package com.waterguard.controller;

import com.waterguard.model.Alert;
import com.waterguard.model.Apartment;
import com.waterguard.model.User;
import com.waterguard.repository.AlertRepository;
import com.waterguard.repository.ApartmentRepository;
import com.waterguard.repository.UserRepository;
import com.waterguard.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AlertController {

    private final AlertRepository alertRepository;
    private final ApartmentRepository apartmentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<Alert>> getHouseholdAlerts(@PathVariable Long householdId) {
        return ResponseEntity.ok(alertRepository.findByHouseholdIdOrderByCreatedAtDesc(householdId));
    }

    @GetMapping("/apartment/{apartmentId}")
    public ResponseEntity<List<Alert>> getApartmentAlerts(@PathVariable Long apartmentId) {
        return ResponseEntity.ok(alertRepository.findByApartmentIdOrderByCreatedAtDesc(apartmentId));
    }

    @PostMapping("/announcements")
    public ResponseEntity<Alert> createAnnouncement(@RequestBody Map<String, Object> request) {
        Long apartmentId = request.containsKey("apartmentId") && request.get("apartmentId") != null
                ? Long.valueOf(request.get("apartmentId").toString())
                : (request.containsKey("communityId") && request.get("communityId") != null ? Long.valueOf(request.get("communityId").toString()) : 1L);
        String title = (String) request.getOrDefault("title", "Community Announcement");
        String body = (String) request.getOrDefault("body", "");
        String priority = (String) request.getOrDefault("priority", "NORMAL");

        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new IllegalArgumentException("Apartment not found with ID: " + apartmentId));

        Alert alert = Alert.builder()
                .apartment(apartment)
                .title(title)
                .message(body)
                .alertType("SYSTEM_ANNOUNCEMENT")
                .severity("URGENT".equalsIgnoreCase(priority) ? "CRITICAL" : "INFO")
                .isRead(false)
                .isResolved(false)
                .build();

        alert = alertRepository.save(alert);

        // Broadcast to all community residents' emails
        List<String> emails = userRepository.findByApartmentId(apartmentId).stream()
                .map(User::getEmail)
                .filter(e -> e != null && !e.isBlank())
                .distinct()
                .toList();

        emailService.sendCommunityAnnouncementEmail(emails, title, body, priority, apartment.getName());

        return ResponseEntity.ok(alert);
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

