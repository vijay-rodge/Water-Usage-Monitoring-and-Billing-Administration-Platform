package com.waterguard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.waterguard.dto.BillingDto;
import com.waterguard.model.*;
import com.waterguard.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingCycleService {

    private final BillingCycleRepository billingCycleRepository;
    private final InvoiceRepository invoiceRepository;
    private final ApartmentRepository apartmentRepository;
    private final HouseholdRepository householdRepository;
    private final TariffPlanRepository tariffPlanRepository;
    private final BulkWaterPurchaseRepository bulkWaterPurchaseRepository;
    private final MeterReadingRepository meterReadingRepository;
    private final TariffBillingEngine tariffBillingEngine;
    private final ApportionmentService apportionmentService;
    private final AlertRepository alertRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public BillingCycle generateBillingCycle(BillingDto.CreateCycleRequest request) {
        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Apartment not found"));

        TariffPlan tariffPlan = tariffPlanRepository.findFirstByApartmentIdAndIsActiveTrueOrderByEffectiveFromDesc(apartment.getId())
                .orElseThrow(() -> new IllegalStateException("No active tariff plan found for apartment"));

        BigDecimal totalBulkCost = bulkWaterPurchaseRepository.sumCostByApartmentAndDateRange(
                apartment.getId(), request.getStartDate(), request.getEndDate()
        );

        List<Household> households = householdRepository.findByApartmentId(apartment.getId());

        BillingCycle cycle = BillingCycle.builder()
                .apartment(apartment)
                .tariffPlan(tariffPlan)
                .cycleName(request.getCycleName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .dueDate(request.getDueDate())
                .status("FINALIZED")
                .build();

        cycle = billingCycleRepository.save(cycle);

        BigDecimal totalMeteredLiters = BigDecimal.ZERO;
        BigDecimal totalBilledSum = BigDecimal.ZERO;

        for (Household household : households) {
            BigDecimal householdConsumption = meterReadingRepository.sumConsumptionByHouseholdAndDateRange(
                    household.getId(), request.getStartDate(), request.getEndDate()
            );

            totalMeteredLiters = totalMeteredLiters.add(householdConsumption);

            BigDecimal apportionedCommonCharge = apportionmentService.calculateHouseholdApportionedCost(
                    household,
                    households,
                    totalBulkCost,
                    "BY_FLAT_SIZE"
            );

            BillingDto.BillingCalculationResult calc = tariffBillingEngine.calculateConsumptionBill(
                    householdConsumption,
                    tariffPlan,
                    apportionedCommonCharge
            );

            totalBilledSum = totalBilledSum.add(calc.getTotalPayable());

            String breakdownJson = "";
            try {
                breakdownJson = objectMapper.writeValueAsString(calc.getTierBreakdown());
            } catch (Exception ignored) {}

            String invoiceNo = String.format("INV-%s-%s", 
                    request.getStartDate().format(DateTimeFormatter.ofPattern("yyyyMM")), 
                    household.getFlatNo().replace("-", ""));

            Invoice invoice = Invoice.builder()
                    .billingCycle(cycle)
                    .household(household)
                    .invoiceNumber(invoiceNo)
                    .totalConsumptionLiters(householdConsumption)
                    .baseFixedCharge(calc.getBaseFixedCharge())
                    .tieredMeteredCharge(calc.getTieredMeteredCharge())
                    .tieredBreakdownJson(breakdownJson)
                    .apportionedCommonAreaCharge(calc.getApportionedCommonAreaCharge())
                    .sewageMaintenanceCharge(calc.getSewageMaintenanceCharge())
                    .totalAmountDue(calc.getTotalPayable())
                    .dueDate(request.getDueDate())
                    .paymentStatus("UNPAID")
                    .build();

            invoiceRepository.save(invoice);
        }

        cycle.setTotalMeteredConsumptionLiters(totalMeteredLiters);
        cycle.setTotalBilledAmount(totalBilledSum);
        return billingCycleRepository.save(cycle);
    }

    public List<BillingDto.InvoiceResponse> getInvoicesForHousehold(Long householdId) {
        return invoiceRepository.findByHouseholdIdOrderByCreatedAtDesc(householdId).stream()
                .map(this::mapToInvoiceResponse)
                .collect(Collectors.toList());
    }

    public List<BillingDto.InvoiceResponse> getInvoicesForApartment(Long apartmentId) {
        return invoiceRepository.findByApartmentId(apartmentId).stream()
                .map(this::mapToInvoiceResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BillingDto.InvoiceResponse recordPayment(Long invoiceId, String paymentRef) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + invoiceId));

        invoice.setPaymentStatus("PAID");
        invoice.setPaymentDate(LocalDateTime.now());
        invoice.setPaymentReference(paymentRef);
        invoice = invoiceRepository.save(invoice);

        return mapToInvoiceResponse(invoice);
    }

    public BillingDto.InvoiceResponse mapToInvoiceResponse(Invoice i) {
        List<BillingDto.TierBreakdownItem> breakdown = new ArrayList<>();
        try {
            if (i.getTieredBreakdownJson() != null && !i.getTieredBreakdownJson().isEmpty()) {
                breakdown = objectMapper.readValue(i.getTieredBreakdownJson(),
                        objectMapper.getTypeFactory().constructCollectionType(List.class, BillingDto.TierBreakdownItem.class));
            }
        } catch (Exception ignored) {}

        return BillingDto.InvoiceResponse.builder()
                .id(i.getId())
                .billingCycleId(i.getBillingCycle().getId())
                .cycleName(i.getBillingCycle().getCycleName())
                .householdId(i.getHousehold().getId())
                .flatNo(i.getHousehold().getFlatNo())
                .blockWing(i.getHousehold().getBlockWing())
                .ownerName(i.getHousehold().getOwnerName())
                .ownerEmail(i.getHousehold().getOwnerEmail())
                .invoiceNumber(i.getInvoiceNumber())
                .totalConsumptionLiters(i.getTotalConsumptionLiters())
                .baseFixedCharge(i.getBaseFixedCharge())
                .tieredMeteredCharge(i.getTieredMeteredCharge())
                .tierBreakdown(breakdown)
                .apportionedCommonAreaCharge(i.getApportionedCommonAreaCharge())
                .sewageMaintenanceCharge(i.getSewageMaintenanceCharge())
                .totalAmountDue(i.getTotalAmountDue())
                .dueDate(i.getDueDate())
                .paymentStatus(i.getPaymentStatus())
                .paymentDate(i.getPaymentDate())
                .paymentReference(i.getPaymentReference())
                .createdAt(i.getCreatedAt())
                .build();
    }
}

