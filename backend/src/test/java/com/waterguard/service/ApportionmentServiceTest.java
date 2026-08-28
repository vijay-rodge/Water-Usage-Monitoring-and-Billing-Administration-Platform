package com.waterguard.service;

import com.waterguard.model.Household;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ApportionmentServiceTest {

    private ApportionmentService apportionmentService;
    private Household h1;
    private Household h2;
    private List<Household> households;

    @BeforeEach
    void setUp() {
        apportionmentService = new ApportionmentService();

        h1 = Household.builder()
                .id(1L)
                .flatNo("A-101")
                .carpetAreaSqft(new BigDecimal("1000.00"))
                .occupancyCount(2)
                .build();

        h2 = Household.builder()
                .id(2L)
                .flatNo("A-102")
                .carpetAreaSqft(new BigDecimal("3000.00"))
                .occupancyCount(6)
                .build();

        households = List.of(h1, h2);
    }

    @Test
    @DisplayName("Test apportionment by flat size: 25% share for 1000/4000 sqft")
    void testApportionmentByFlatSize() {
        BigDecimal totalCost = new BigDecimal("4000.00");
        BigDecimal result = apportionmentService.calculateHouseholdApportionedCost(h1, households, totalCost, "BY_FLAT_SIZE");

        assertEquals(new BigDecimal("1000.00"), result);
    }

    @Test
    @DisplayName("Test apportionment equal share: 50% for 2 households")
    void testApportionmentEqual() {
        BigDecimal totalCost = new BigDecimal("4000.00");
        BigDecimal result = apportionmentService.calculateHouseholdApportionedCost(h1, households, totalCost, "EQUAL");

        assertEquals(new BigDecimal("2000.00"), result);
    }
}

