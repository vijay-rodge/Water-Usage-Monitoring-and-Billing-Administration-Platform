package com.waterguard.controller;

import com.waterguard.dto.BillingDto;
import com.waterguard.model.TariffPlan;
import com.waterguard.repository.TariffPlanRepository;
import com.waterguard.service.TariffBillingEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/tariff")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class TariffController {

    private final TariffPlanRepository tariffPlanRepository;
    private final TariffBillingEngine tariffBillingEngine;

    @GetMapping("/apartment/{apartmentId}")
    public ResponseEntity<List<TariffPlan>> getApartmentTariffPlans(@PathVariable Long apartmentId) {
        return ResponseEntity.ok(tariffPlanRepository.findByApartmentIdOrderByEffectiveFromDesc(apartmentId));
    }

    @GetMapping("/apartment/{apartmentId}/active")
    public ResponseEntity<TariffPlan> getActiveTariffPlan(@PathVariable Long apartmentId) {
        return tariffPlanRepository.findFirstByApartmentIdAndIsActiveTrueOrderByEffectiveFromDesc(apartmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/calculate-preview")
    public ResponseEntity<BillingDto.BillingCalculationResult> calculatePreview(
            @RequestParam Long apartmentId,
            @RequestParam BigDecimal consumptionLiters,
            @RequestParam(required = false, defaultValue = "0") BigDecimal commonAreaCost
    ) {
        TariffPlan plan = tariffPlanRepository.findFirstByApartmentIdAndIsActiveTrueOrderByEffectiveFromDesc(apartmentId)
                .orElseThrow(() -> new IllegalArgumentException("No active tariff plan found"));

        return ResponseEntity.ok(tariffBillingEngine.calculateConsumptionBill(consumptionLiters, plan, commonAreaCost));
    }
}

