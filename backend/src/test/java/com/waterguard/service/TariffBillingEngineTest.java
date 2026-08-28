package com.waterguard.service;

import com.waterguard.dto.BillingDto;
import com.waterguard.model.TariffPlan;
import com.waterguard.model.TariffTier;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TariffBillingEngineTest {

    private TariffBillingEngine billingEngine;
    private TariffPlan samplePlan;

    @BeforeEach
    void setUp() {
        billingEngine = new TariffBillingEngine();

        TariffTier tier1 = TariffTier.builder()
                .tierLevel(1)
                .tierName("Tier 1 - Essential")
                .minLiters(new BigDecimal("0.00"))
                .maxLiters(new BigDecimal("8000.00"))
                .ratePer1000Liters(new BigDecimal("16.00"))
                .build();

        TariffTier tier2 = TariffTier.builder()
                .tierLevel(2)
                .tierName("Tier 2 - Standard")
                .minLiters(new BigDecimal("8001.00"))
                .maxLiters(new BigDecimal("15000.00"))
                .ratePer1000Liters(new BigDecimal("26.00"))
                .build();

        samplePlan = TariffPlan.builder()
                .baseFixedCharge(new BigDecimal("150.00"))
                .sewageMaintenancePct(new BigDecimal("10.00"))
                .bulkPurchaseMarkupPct(new BigDecimal("5.00"))
                .tiers(List.of(tier1, tier2))
                .build();
    }

    @Test
    @DisplayName("Test within Tier 1 consumption: 5,000 Liters")
    void testTier1Consumption() {
        BillingDto.BillingCalculationResult result = billingEngine.calculateConsumptionBill(
                new BigDecimal("5000.00"), samplePlan, BigDecimal.ZERO
        );

        assertNotNull(result);
        assertEquals(new BigDecimal("150.00"), result.getBaseFixedCharge());
        assertEquals(new BigDecimal("80.00"), result.getTieredMeteredCharge());
        assertEquals(new BigDecimal("8.00"), result.getSewageMaintenanceCharge());
        assertEquals(new BigDecimal("238.00"), result.getTotalPayable());
    }

    @Test
    @DisplayName("Test multi-tier consumption: 13,010 Liters spanning Tier 1 & Tier 2")
    void testMultiTierConsumption() {
        BigDecimal apportioned = new BigDecimal("192.40");
        BillingDto.BillingCalculationResult result = billingEngine.calculateConsumptionBill(
                new BigDecimal("13010.00"), samplePlan, apportioned
        );

        assertEquals(new BigDecimal("258.25"), result.getTieredMeteredCharge());
        assertEquals(new BigDecimal("25.83"), result.getSewageMaintenanceCharge());
        assertEquals(new BigDecimal("626.48"), result.getTotalPayable());
    }
}

