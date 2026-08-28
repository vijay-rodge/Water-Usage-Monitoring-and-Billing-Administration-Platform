package com.waterguard.controller;

import com.waterguard.dto.BillingDto;
import com.waterguard.model.BillingCycle;
import com.waterguard.service.BillingCycleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/billing")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class BillingController {

    private final BillingCycleService billingCycleService;

    @PostMapping("/cycles")
    public ResponseEntity<BillingCycle> createBillingCycle(@Valid @RequestBody BillingDto.CreateCycleRequest request) {
        return ResponseEntity.ok(billingCycleService.generateBillingCycle(request));
    }

    @GetMapping("/invoices/household/{householdId}")
    public ResponseEntity<List<BillingDto.InvoiceResponse>> getHouseholdInvoices(@PathVariable Long householdId) {
        return ResponseEntity.ok(billingCycleService.getInvoicesForHousehold(householdId));
    }

    @GetMapping("/invoices/apartment/{apartmentId}")
    public ResponseEntity<List<BillingDto.InvoiceResponse>> getApartmentInvoices(@PathVariable Long apartmentId) {
        return ResponseEntity.ok(billingCycleService.getInvoicesForApartment(apartmentId));
    }

    @PostMapping("/invoices/{invoiceId}/pay")
    public ResponseEntity<BillingDto.InvoiceResponse> payInvoice(
            @PathVariable Long invoiceId,
            @Valid @RequestBody BillingDto.PaymentRecordRequest request
    ) {
        return ResponseEntity.ok(billingCycleService.recordPayment(invoiceId, request.getPaymentReference()));
    }
}
