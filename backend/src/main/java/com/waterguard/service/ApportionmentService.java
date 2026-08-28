package com.waterguard.service;

import com.waterguard.model.Household;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ApportionmentService {

    public BigDecimal calculateHouseholdApportionedCost(
            Household household,
            List<Household> allHouseholdsInApartment,
            BigDecimal totalCommonAreaCost,
            String method
    ) {
        if (totalCommonAreaCost == null || totalCommonAreaCost.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        if (allHouseholdsInApartment == null || allHouseholdsInApartment.isEmpty()) {
            return BigDecimal.ZERO;
        }

        if (method == null) {
            method = "BY_FLAT_SIZE";
        }

        switch (method.toUpperCase()) {
            case "BY_OCCUPANCY": {
                int totalOccupancy = allHouseholdsInApartment.stream()
                        .mapToInt(Household::getOccupancyCount)
                        .sum();
                if (totalOccupancy == 0) totalOccupancy = 1;

                BigDecimal ratio = new BigDecimal(household.getOccupancyCount())
                        .divide(new BigDecimal(totalOccupancy), 6, RoundingMode.HALF_UP);
                return totalCommonAreaCost.multiply(ratio).setScale(2, RoundingMode.HALF_UP);
            }

            case "EQUAL": {
                BigDecimal count = new BigDecimal(allHouseholdsInApartment.size());
                return totalCommonAreaCost.divide(count, 2, RoundingMode.HALF_UP);
            }

            case "BY_FLAT_SIZE":
            default: {
                BigDecimal totalCarpetArea = allHouseholdsInApartment.stream()
                        .map(Household::getCarpetAreaSqft)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                if (totalCarpetArea.compareTo(BigDecimal.ZERO) <= 0) {
                    return totalCommonAreaCost.divide(new BigDecimal(allHouseholdsInApartment.size()), 2, RoundingMode.HALF_UP);
                }

                BigDecimal ratio = household.getCarpetAreaSqft()
                        .divide(totalCarpetArea, 6, RoundingMode.HALF_UP);
                return totalCommonAreaCost.multiply(ratio).setScale(2, RoundingMode.HALF_UP);
            }
        }
    }
}
