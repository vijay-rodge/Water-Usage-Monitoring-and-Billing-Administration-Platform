package com.waterguard.controller;

import com.waterguard.config.UserPrincipal;
import com.waterguard.dto.InvoiceDto;
import com.waterguard.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class InvoiceController {

    private final InvoiceService invoiceService;

    /**
     * Submit bulk water purchase, validate & calculate prices on backend,
     * and automatically trigger invoice creation & SMTP email workflow.
     */
    @PostMapping("/invoices/purchase")
    public ResponseEntity<InvoiceDto.OrderInvoiceResponse> createPurchase(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody InvoiceDto.CreateWaterOrderRequest request
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(invoiceService.createBulkWaterPurchase(principal, request));
    }

    /**
     * Generate invoice for an existing order (Idempotent).
     */
    @PostMapping("/invoices/generate/{orderId}")
    public ResponseEntity<InvoiceDto.OrderInvoiceResponse> generateInvoice(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long orderId
    ) {
        InvoiceDto.OrderInvoiceResponse invoice = invoiceService.generateInvoice(orderId);
        checkAccess(principal, invoice.getUserId());
        return ResponseEntity.ok(invoice);
    }

    /**
     * Get invoice details by ID.
     */
    @GetMapping("/invoices/{invoiceId}")
    public ResponseEntity<InvoiceDto.OrderInvoiceResponse> getInvoice(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long invoiceId
    ) {
        InvoiceDto.OrderInvoiceResponse invoice = invoiceService.getInvoiceById(invoiceId);
        checkAccess(principal, invoice.getUserId());
        return ResponseEntity.ok(invoice);
    }

    /**
     * Download invoice PDF.
     */
    @GetMapping("/invoices/{invoiceId}/download")
    public ResponseEntity<byte[]> downloadInvoice(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long invoiceId
    ) {
        InvoiceDto.OrderInvoiceResponse invoice = invoiceService.getInvoiceById(invoiceId);
        checkAccess(principal, invoice.getUserId());

        byte[] pdfBytes = invoiceService.getInvoicePdfBytes(invoiceId);
        String fileName = "invoice_" + invoice.getInvoiceNumber() + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(pdfBytes);
    }

    /**
     * Resend invoice PDF via existing SMTP (Retry mechanism for failed emails).
     */
    @PostMapping("/invoices/{invoiceId}/resend")
    public ResponseEntity<InvoiceDto.OrderInvoiceResponse> resendInvoice(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long invoiceId
    ) {
        InvoiceDto.OrderInvoiceResponse existing = invoiceService.getInvoiceById(invoiceId);
        checkAccess(principal, existing.getUserId());

        InvoiceDto.OrderInvoiceResponse updated = invoiceService.resendInvoice(invoiceId);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get invoices for a specific user.
     */
    @GetMapping("/users/{userId}/invoices")
    public ResponseEntity<List<InvoiceDto.OrderInvoiceResponse>> getUserInvoices(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long userId
    ) {
        checkAccess(principal, userId);
        return ResponseEntity.ok(invoiceService.getUserInvoices(userId));
    }

    /**
     * Admin view: List all invoices across the platform.
     */
    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceDto.OrderInvoiceResponse>> getAllInvoices(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (!isAdmin(principal)) {
            throw new AccessDeniedException("Access denied: Admin privileges required to view all invoices.");
        }
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    private void checkAccess(UserPrincipal principal, Long resourceUserId) {
        if (principal == null) {
            throw new AccessDeniedException("Authentication required.");
        }
        if (isAdmin(principal)) {
            return;
        }
        if (resourceUserId != null && resourceUserId.equals(principal.getUserId())) {
            return;
        }
        throw new AccessDeniedException("Access denied: You do not have permission to access this invoice.");
    }

    private boolean isAdmin(UserPrincipal principal) {
        if (principal == null || principal.getAuthorities() == null) {
            return false;
        }
        return principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ADMIN")
                        || a.getAuthority().equalsIgnoreCase("ROLE_ADMIN")
                        || a.getAuthority().equalsIgnoreCase("SUPER_ADMIN"));
    }
}
