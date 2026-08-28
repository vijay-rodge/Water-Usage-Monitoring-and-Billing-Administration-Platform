package com.waterguard.service;

import com.waterguard.dto.BillingDto;
import com.waterguard.model.TariffPlan;
import com.waterguard.model.TariffTier;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class TariffBillingEngine {

    public BillingDto.BillingCalculationResult calculateConsumptionBill(
            BigDecimal totalConsumptionLiters,
            TariffPlan tariffPlan,
            BigDecimal apportionedCommonAreaCharge
    ) {
        if (totalConsumptionLiters == null || totalConsumptionLiters.compareTo(BigDecimal.ZERO) < 0) {
            totalConsumptionLiters = BigDecimal.ZERO;
        }

        BigDecimal remainingLiters = totalConsumptionLiters;
        BigDecimal totalMeteredCharge = BigDecimal.ZERO;
        List<BillingDto.TierBreakdownItem> breakdownItems = new ArrayList<>();

        List<TariffTier> tiers = tariffPlan.getTiers();

        for (TariffTier tier : tiers) {
            if (remainingLiters.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal tierCapacity;
            if (tier.getMaxLiters() == null) {
                tierCapacity = remainingLiters;
            } else {
                tierCapacity = tier.getMaxLiters().subtract(tier.getMinLiters()).add(BigDecimal.ONE);
            }

            BigDecimal litersInThisTier = remainingLiters.min(tierCapacity);
            if (litersInThisTier.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal cost = litersInThisTier
                        .divide(new BigDecimal("1000.00"), 4, RoundingMode.HALF_UP)
                        .multiply(tier.getRatePer1000Liters())
                        .setScale(2, RoundingMode.HALF_UP);

                totalMeteredCharge = totalMeteredCharge.add(cost);

                breakdownItems.add(BillingDto.TierBreakdownItem.builder()
                        .tierLevel(tier.getTierLevel())
                        .tierName(tier.getTierName())
                        .consumedLiters(litersInThisTier.setScale(2, RoundingMode.HALF_UP))
                        .ratePer1000Liters(tier.getRatePer1000Liters())
                        .cost(cost)
                        .build());

                remainingLiters = remainingLiters.subtract(litersInThisTier);
            }
        }

        BigDecimal baseFixedCharge = tariffPlan.getBaseFixedCharge();
        BigDecimal sewagePct = tariffPlan.getSewageMaintenancePct().divide(new BigDecimal("100.00"), 4, RoundingMode.HALF_UP);
        BigDecimal sewageCharge = totalMeteredCharge.multiply(sewagePct).setScale(2, RoundingMode.HALF_UP);
        BigDecimal commonCharge = apportionedCommonAreaCharge != null ? apportionedCommonAreaCharge : BigDecimal.ZERO;

        BigDecimal totalPayable = baseFixedCharge
                .add(totalMeteredCharge)
                .add(sewageCharge)
                .add(commonCharge)
                .setScale(2, RoundingMode.HALF_UP);

        return BillingDto.BillingCalculationResult.builder()
                .totalConsumptionLiters(totalConsumptionLiters)
                .baseFixedCharge(baseFixedCharge)
                .tieredMeteredCharge(totalMeteredCharge)
                .tierBreakdown(breakdownItems)
                .sewageMaintenanceCharge(sewageCharge)
                .apportionedCommonAreaCharge(commonCharge)
                .totalPayable(totalPayable)
                .build();
    }
}

