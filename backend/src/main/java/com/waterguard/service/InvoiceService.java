package com.waterguard.service;

import com.waterguard.config.UserPrincipal;
import com.waterguard.dto.InvoiceDto;
import com.waterguard.model.Apartment;
import com.waterguard.model.OrderInvoice;
import com.waterguard.model.User;
import com.waterguard.model.WaterOrder;
import com.waterguard.repository.ApartmentRepository;
import com.waterguard.repository.OrderInvoiceRepository;
import com.waterguard.repository.UserRepository;
import com.waterguard.repository.WaterOrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final WaterOrderRepository waterOrderRepository;
    private final OrderInvoiceRepository orderInvoiceRepository;
    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;
    private final PdfInvoiceService pdfInvoiceService;
    private final EmailService emailService;

    private static final DecimalFormat CURRENCY_FMT = new DecimalFormat("#,##0.00");
    private static final DecimalFormat QTY_FMT = new DecimalFormat("#,##0");

    /**
     * Create bulk water order, validate prices on backend, and trigger automated invoice & email pipeline.
     */
    @Transactional
    public InvoiceDto.OrderInvoiceResponse createBulkWaterPurchase(UserPrincipal principal, InvoiceDto.CreateWaterOrderRequest request) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + principal.getUserId()));

        // Update billing and organization details if provided
        if (request.getBillingAddress() != null && !request.getBillingAddress().isBlank()) {
            user.setBillingAddress(request.getBillingAddress().trim());
        }
        if (request.getOrganizationName() != null && !request.getOrganizationName().isBlank()) {
            user.setOrganizationName(request.getOrganizationName().trim());
        }
        userRepository.save(user);

        // Backend Price & Total Calculation (Do NOT trust frontend totals)
        BigDecimal quantity = request.getQuantityLiters();
        if (quantity == null || quantity.compareTo(BigDecimal.valueOf(100)) < 0) {
            throw new IllegalArgumentException("Minimum order quantity is 100 Liters");
        }

        String waterType = (request.getWaterType() != null && !request.getWaterType().isBlank())
                ? request.getWaterType()
                : "Potable Tanker Water";

        // Unit Price per 1,000 Liters
        BigDecimal unitPricePerKl;
        if (waterType.toLowerCase().contains("ro") || waterType.toLowerCase().contains("reverse osmosis")) {
            unitPricePerKl = new BigDecimal("500.00");
        } else if (waterType.toLowerCase().contains("commercial")) {
            unitPricePerKl = new BigDecimal("300.00");
        } else {
            unitPricePerKl = new BigDecimal("350.00"); // Potable Bulk Tanker
        }

        // Subtotal = (Quantity / 1000) * Unit Price
        BigDecimal subtotal = quantity.divide(new BigDecimal("1000"), 4, RoundingMode.HALF_UP)
                .multiply(unitPricePerKl)
                .setScale(2, RoundingMode.HALF_UP);

        // Bulk Discount: 5% discount for 10,000 Liters and above
        BigDecimal discount = BigDecimal.ZERO;
        if (quantity.compareTo(new BigDecimal("10000")) >= 0) {
            discount = subtotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        }

        // Tax / GST: 5% on discounted amount
        BigDecimal taxableAmount = subtotal.subtract(discount);
        BigDecimal tax = taxableAmount.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);

        // Delivery Charges: ₹150 flat delivery fee
        BigDecimal deliveryCharges = new BigDecimal("150.00");

        // Total Amount = Subtotal - Discount + Tax + Delivery Charges
        BigDecimal totalAmount = taxableAmount.add(tax).add(deliveryCharges).setScale(2, RoundingMode.HALF_UP);

        // Generate Order ID: ORD-XXXXXX
        String orderNumber = "ORD-" + (System.currentTimeMillis() % 1000000);
        String paymentRef = (request.getPaymentReference() != null && !request.getPaymentReference().isBlank())
                ? request.getPaymentReference().trim()
                : "UPI-TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Apartment apt = user.getApartment();
        if (apt == null && principal.getCommunityId() != null) {
            apt = apartmentRepository.findById(principal.getCommunityId()).orElse(null);
        }

        WaterOrder order = WaterOrder.builder()
                .orderNumber(orderNumber)
                .user(user)
                .apartment(apt)
                .orderDate(LocalDateTime.now())
                .waterType(waterType)
                .quantityLiters(quantity)
                .unitPrice(unitPricePerKl)
                .subtotal(subtotal)
                .discount(discount)
                .tax(tax)
                .deliveryCharges(deliveryCharges)
                .totalAmount(totalAmount)
                .paymentStatus("PAID")
                .paymentReference(paymentRef)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI")
                .deliveryAddress(request.getDeliveryAddress() != null ? request.getDeliveryAddress() : user.getBillingAddress())
                .customerNotes(request.getCustomerNotes())
                .build();

        order = waterOrderRepository.save(order);
        log.info("Created and saved bulk water order #{} for user {}", order.getOrderNumber(), user.getEmail());

        // Automatically generate invoice and send email
        return generateInvoice(order.getId());
    }

    /**
     * Idempotent Invoice Generation & Email Dispatch workflow.
     */
    @Transactional
    public InvoiceDto.OrderInvoiceResponse generateInvoice(Long orderId) {
        // 1. Idempotency Check: if invoice already generated for this order, return it
        Optional<OrderInvoice> existing = orderInvoiceRepository.findByOrderId(orderId);
        if (existing.isPresent()) {
            log.info("Invoice already exists for order ID {}. Returning existing invoice #{}", orderId, existing.get().getInvoiceNumber());
            return mapToResponse(existing.get());
        }

        // 2. Fetch Order and User from PostgreSQL
        WaterOrder order = waterOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Water order not found with ID: " + orderId));

        User user = order.getUser();

        // 3. Generate Unique Invoice Number (e.g. INV-2026-000123)
        String invoiceNumber = String.format("INV-%d-%06d", LocalDate.now().getYear(), order.getId());

        // 4. Create and Save Invoice Record
        OrderInvoice invoice = OrderInvoice.builder()
                .invoiceNumber(invoiceNumber)
                .order(order)
                .user(user)
                .invoiceDate(LocalDate.now())
                .subtotal(order.getSubtotal())
                .discount(order.getDiscount())
                .tax(order.getTax())
                .deliveryCharge(order.getDeliveryCharges())
                .totalAmount(order.getTotalAmount())
                .customerEmail(user.getEmail())
                .pdfReference("invoice_" + invoiceNumber + ".pdf")
                .emailSent(false)
                .build();

        invoice = orderInvoiceRepository.save(invoice);
        log.info("Created invoice record #{} for order #{}", invoice.getInvoiceNumber(), order.getOrderNumber());

        // 5. Generate Professional PDF
        byte[] pdfBytes;
        try {
            pdfBytes = pdfInvoiceService.generateInvoicePdf(invoice);
            log.info("Generated PDF for invoice #{} ({} bytes)", invoice.getInvoiceNumber(), pdfBytes.length);
        } catch (Exception ex) {
            log.error("Error creating PDF for invoice #{}: {}", invoice.getInvoiceNumber(), ex.getMessage(), ex);
            throw new RuntimeException("Failed to generate invoice PDF: " + ex.getMessage(), ex);
        }

        // 6. Send PDF through Existing SMTP
        String qtyFormatted = QTY_FMT.format(order.getQuantityLiters()) + " L";
        String totalFormatted = "₹" + CURRENCY_FMT.format(invoice.getTotalAmount());
        String pdfFilename = "invoice_" + invoice.getInvoiceNumber() + ".pdf";

        try {
            emailService.sendWaterOrderInvoiceEmail(
                    invoice.getCustomerEmail(),
                    user.getFullName(),
                    order.getOrderNumber(),
                    invoice.getInvoiceNumber(),
                    qtyFormatted,
                    totalFormatted,
                    pdfBytes,
                    pdfFilename
            );
            invoice.setEmailSent(true);
            invoice.setEmailSentAt(LocalDateTime.now());
            invoice.setEmailError(null);
            log.info("Successfully dispatched invoice #{} email to {}", invoice.getInvoiceNumber(), invoice.getCustomerEmail());
        } catch (Exception e) {
            log.error("Failed to send invoice #{} email via SMTP: {}. Invoice record preserved.", invoice.getInvoiceNumber(), e.getMessage());
            invoice.setEmailSent(false);
            invoice.setEmailError(e.getMessage());
        }

        invoice = orderInvoiceRepository.save(invoice);
        return mapToResponse(invoice);
    }

    /**
     * Resend invoice email (e.g. for failed emails) without affecting order or payment status.
     */
    @Transactional
    public InvoiceDto.OrderInvoiceResponse resendInvoice(Long invoiceId) {
        OrderInvoice invoice = orderInvoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with ID: " + invoiceId));

        WaterOrder order = invoice.getOrder();
        User user = invoice.getUser();

        // Load existing PDF or re-generate if needed
        byte[] pdfBytes = pdfInvoiceService.loadPdfFromDisk(invoice.getInvoiceNumber());
        if (pdfBytes == null || pdfBytes.length == 0) {
            pdfBytes = pdfInvoiceService.generateInvoicePdf(invoice);
        }

        String qtyFormatted = QTY_FMT.format(order.getQuantityLiters()) + " L";
        String totalFormatted = "₹" + CURRENCY_FMT.format(invoice.getTotalAmount());
        String pdfFilename = "invoice_" + invoice.getInvoiceNumber() + ".pdf";

        try {
            emailService.sendWaterOrderInvoiceEmail(
                    invoice.getCustomerEmail(),
                    user.getFullName(),
                    order.getOrderNumber(),
                    invoice.getInvoiceNumber(),
                    qtyFormatted,
                    totalFormatted,
                    pdfBytes,
                    pdfFilename
            );
            invoice.setEmailSent(true);
            invoice.setEmailSentAt(LocalDateTime.now());
            invoice.setEmailError(null);
            log.info("Successfully re-sent invoice #{} to {}", invoice.getInvoiceNumber(), invoice.getCustomerEmail());
        } catch (Exception e) {
            log.error("Failed to re-send invoice #{} email via SMTP: {}", invoice.getInvoiceNumber(), e.getMessage());
            invoice.setEmailSent(false);
            invoice.setEmailError(e.getMessage());
        }

        invoice = orderInvoiceRepository.save(invoice);
        return mapToResponse(invoice);
    }

    public InvoiceDto.OrderInvoiceResponse getInvoiceById(Long invoiceId) {
        OrderInvoice invoice = orderInvoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with ID: " + invoiceId));
        return mapToResponse(invoice);
    }

    public byte[] getInvoicePdfBytes(Long invoiceId) {
        OrderInvoice invoice = orderInvoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with ID: " + invoiceId));

        byte[] bytes = pdfInvoiceService.loadPdfFromDisk(invoice.getInvoiceNumber());
        if (bytes == null || bytes.length == 0) {
            bytes = pdfInvoiceService.generateInvoicePdf(invoice);
        }
        return bytes;
    }

    public List<InvoiceDto.OrderInvoiceResponse> getUserInvoices(Long userId) {
        return orderInvoiceRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<InvoiceDto.OrderInvoiceResponse> getAllInvoices() {
        return orderInvoiceRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private InvoiceDto.OrderInvoiceResponse mapToResponse(OrderInvoice inv) {
        WaterOrder order = inv.getOrder();
        User user = inv.getUser();

        return InvoiceDto.OrderInvoiceResponse.builder()
                .id(inv.getId())
                .invoiceNumber(inv.getInvoiceNumber())
                .orderId(order != null ? order.getId() : null)
                .orderNumber(order != null ? order.getOrderNumber() : null)
                .userId(user != null ? user.getId() : null)
                .customerName(user != null ? user.getFullName() : null)
                .customerEmail(inv.getCustomerEmail())
                .customerPhone(user != null ? user.getPhone() : null)
                .billingAddress(user != null ? user.getBillingAddress() : null)
                .organizationName(user != null ? user.getOrganizationName() : null)
                .invoiceDate(inv.getInvoiceDate())
                .waterType(order != null ? order.getWaterType() : null)
                .quantityLiters(order != null ? order.getQuantityLiters() : null)
                .unitPrice(order != null ? order.getUnitPrice() : null)
                .subtotal(inv.getSubtotal())
                .discount(inv.getDiscount())
                .tax(inv.getTax())
                .deliveryCharge(inv.getDeliveryCharge())
                .totalAmount(inv.getTotalAmount())
                .paymentStatus(order != null ? order.getPaymentStatus() : "PAID")
                .paymentReference(order != null ? order.getPaymentReference() : null)
                .paymentMethod(order != null ? order.getPaymentMethod() : "UPI")
                .pdfReference(inv.getPdfReference())
                .emailSent(inv.getEmailSent())
                .emailSentAt(inv.getEmailSentAt())
                .emailError(inv.getEmailError())
                .createdAt(inv.getCreatedAt())
                .build();
    }
}
