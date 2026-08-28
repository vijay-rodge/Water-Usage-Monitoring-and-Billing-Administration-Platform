package com.waterguard.controller;

import com.waterguard.model.Apartment;
import com.waterguard.model.Household;
import com.waterguard.repository.ApartmentRepository;
import com.waterguard.repository.HouseholdRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apartments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ApartmentController {

    private final ApartmentRepository apartmentRepository;
    private final HouseholdRepository householdRepository;

    @GetMapping
    public ResponseEntity<List<Apartment>> getAllApartments() {
        return ResponseEntity.ok(apartmentRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Apartment> getApartmentById(@PathVariable Long id) {
        return apartmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/households")
    public ResponseEntity<List<Household>> getApartmentHouseholds(@PathVariable Long id) {
        return ResponseEntity.ok(householdRepository.findByApartmentId(id));
    }
}
