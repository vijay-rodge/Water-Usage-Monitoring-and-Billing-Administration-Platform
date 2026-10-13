package com.waterguard.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.waterguard.model.OrderInvoice;
import com.waterguard.model.WaterOrder;
import com.waterguard.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PdfInvoiceService {

    private static final String UPLOAD_DIR = "uploads/invoices";
    private static final DecimalFormat CURRENCY_FMT = new DecimalFormat("#,##0.00");
    private static final DecimalFormat QTY_FMT = new DecimalFormat("#,##0");

    // Colors
    private static final Color PRIMARY_COLOR = new Color(2, 132, 199); // Sky/Water Blue
    private static final Color DARK_BLUE = new Color(30, 58, 138);
    private static final Color HEADER_BG = new Color(241, 245, 249);
    private static final Color TEXT_DARK = new Color(30, 41, 59);
    private static final Color TEXT_MUTED = new Color(100, 116, 139);
    private static final Color BORDER_COLOR = new Color(226, 232, 240);
    private static final Color SUCCESS_BG = new Color(220, 252, 231);
    private static final Color SUCCESS_TEXT = new Color(22, 101, 52);

    public byte[] generateInvoicePdf(OrderInvoice invoice) {
        WaterOrder order = invoice.getOrder();
        User user = invoice.getUser();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 40, 40);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Font configurations
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, PRIMARY_COLOR);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, TEXT_MUTED);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, DARK_BLUE);
            Font regularFont = FontFactory.getFont(FontFactory.HELVETICA, 9, TEXT_DARK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, TEXT_DARK);
            Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, DARK_BLUE);

            // 1. Header Table (Brand / Title)
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60, 40});

            // Company branding
            PdfPCell brandCell = new PdfPCell();
            brandCell.setBorder(Rectangle.NO_BORDER);
            brandCell.addElement(new Paragraph("AQUAFLOW", titleFont));
            brandCell.addElement(new Paragraph("Smart Water Administration Platform", subtitleFont));
            brandCell.addElement(new Paragraph("Municipal Bulk Water Distribution & Monitoring", subtitleFont));
            brandCell.addElement(new Paragraph("Email: support@aquaflow.org | Web: aquaflow.local", subtitleFont));
            headerTable.addCell(brandCell);

            // Invoice Title & Status
            PdfPCell invoiceMetaCell = new PdfPCell();
            invoiceMetaCell.setBorder(Rectangle.NO_BORDER);
            invoiceMetaCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

            Paragraph pInv = new Paragraph("TAX INVOICE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, DARK_BLUE));
            pInv.setAlignment(Element.ALIGN_RIGHT);
            invoiceMetaCell.addElement(pInv);

            Paragraph pInvNum = new Paragraph("Invoice #: " + invoice.getInvoiceNumber(), boldFont);
            pInvNum.setAlignment(Element.ALIGN_RIGHT);
            invoiceMetaCell.addElement(pInvNum);

            String formattedDate = invoice.getInvoiceDate() != null
                    ? invoice.getInvoiceDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"))
                    : "";
            Paragraph pDate = new Paragraph("Date: " + formattedDate, regularFont);
            pDate.setAlignment(Element.ALIGN_RIGHT);
            invoiceMetaCell.addElement(pDate);

            // Paid Stamp Badge
            PdfPTable badgeTable = new PdfPTable(1);
            badgeTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            badgeTable.setTotalWidth(90);
            badgeTable.setLockedWidth(true);
            PdfPCell badgeCell = new PdfPCell(new Phrase("✓ " + order.getPaymentStatus().toUpperCase(), 
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, SUCCESS_TEXT)));
            badgeCell.setBackgroundColor(SUCCESS_BG);
            badgeCell.setBorder(Rectangle.NO_BORDER);
            badgeCell.setPadding(4);
            badgeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            badgeTable.addCell(badgeCell);
            invoiceMetaCell.addElement(new Paragraph(" "));
            invoiceMetaCell.addElement(badgeTable);

            headerTable.addCell(invoiceMetaCell);
            document.add(headerTable);

            document.add(new Paragraph(" ")); // Spacer

            // 2. Info Cards (Billed To vs Order Details)
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{50, 50});

            // Customer Info Box
            PdfPCell customerCell = new PdfPCell();
            customerCell.setBackgroundColor(HEADER_BG);
            customerCell.setPadding(12);
            customerCell.setBorderColor(BORDER_COLOR);
            customerCell.setBorderWidth(1);

            customerCell.addElement(new Paragraph("BILLED TO:", sectionTitleFont));
            customerCell.addElement(new Paragraph(user.getFullName() != null ? user.getFullName() : "Customer", boldFont));
            if (user.getHousehold() != null && user.getHousehold().getFlatNo() != null) {
                String unit = "Flat No: " + user.getHousehold().getFlatNo() + (user.getHousehold().getBlockWing() != null ? " (" + user.getHousehold().getBlockWing() + ")" : "");
                customerCell.addElement(new Paragraph(unit, regularFont));
            }
            if (user.getOrganizationName() != null && !user.getOrganizationName().isBlank()) {
                customerCell.addElement(new Paragraph("Org: " + user.getOrganizationName(), regularFont));
            }
            customerCell.addElement(new Paragraph("Email: " + invoice.getCustomerEmail(), regularFont));
            if (user.getPhone() != null && !user.getPhone().isBlank()) {
                customerCell.addElement(new Paragraph("Phone: " + user.getPhone(), regularFont));
            }
            String billingAddress = user.getBillingAddress();
            if (billingAddress == null || billingAddress.isBlank()) {
                billingAddress = order.getDeliveryAddress();
            }
            if (billingAddress != null && !billingAddress.isBlank()) {
                customerCell.addElement(new Paragraph("Address: " + billingAddress, regularFont));
            }
            infoTable.addCell(customerCell);

            // Order Meta Box
            PdfPCell orderMetaBox = new PdfPCell();
            orderMetaBox.setBackgroundColor(HEADER_BG);
            orderMetaBox.setPadding(12);
            orderMetaBox.setBorderColor(BORDER_COLOR);
            orderMetaBox.setBorderWidth(1);

            orderMetaBox.addElement(new Paragraph("PURCHASE DETAILS:", sectionTitleFont));
            orderMetaBox.addElement(new Paragraph("Order Number: " + order.getOrderNumber(), boldFont));
            String orderTimeStr = order.getOrderDate() != null
                    ? order.getOrderDate().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy, hh:mm a"))
                    : "";
            orderMetaBox.addElement(new Paragraph("Order Date: " + orderTimeStr, regularFont));
            orderMetaBox.addElement(new Paragraph("Payment Method: " + (order.getPaymentMethod() != null ? order.getPaymentMethod() : "UPI / Net Banking"), regularFont));
            if (order.getPaymentReference() != null && !order.getPaymentReference().isBlank()) {
                orderMetaBox.addElement(new Paragraph("Payment Ref: " + order.getPaymentReference(), regularFont));
            }
            if (order.getDeliveryAddress() != null && !order.getDeliveryAddress().isBlank()) {
                orderMetaBox.addElement(new Paragraph("Delivery Point: " + order.getDeliveryAddress(), regularFont));
            }
            infoTable.addCell(orderMetaBox);

            document.add(infoTable);
            document.add(new Paragraph(" ")); // Spacer

            // 3. Line Items Table
            PdfPTable itemTable = new PdfPTable(4);
            itemTable.setWidthPercentage(100);
            itemTable.setWidths(new float[]{45, 20, 15, 20});

            // Table Headers
            String[] headers = {"Item Description", "Quantity", "Unit Rate", "Amount (INR)"};
            for (String h : headers) {
                PdfPCell th = new PdfPCell(new Phrase(h, tableHeaderFont));
                th.setBackgroundColor(DARK_BLUE);
                th.setPadding(8);
                th.setBorderColor(DARK_BLUE);
                if (h.contains("Quantity") || h.contains("Rate") || h.contains("Amount")) {
                    th.setHorizontalAlignment(Element.ALIGN_RIGHT);
                }
                itemTable.addCell(th);
            }

            // Line Item Row
            String itemDesc = (order.getWaterType() != null && !order.getWaterType().isBlank())
                    ? order.getWaterType()
                    : "Potable Bulk Tanker Water";
            PdfPCell descCell = new PdfPCell(new Phrase(itemDesc, regularFont));
            descCell.setPadding(8);
            descCell.setBorderColor(BORDER_COLOR);
            itemTable.addCell(descCell);

            String qtyStr = QTY_FMT.format(order.getQuantityLiters()) + " L";
            PdfPCell qtyCell = new PdfPCell(new Phrase(qtyStr, regularFont));
            qtyCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            qtyCell.setPadding(8);
            qtyCell.setBorderColor(BORDER_COLOR);
            itemTable.addCell(qtyCell);

            String rateStr = "₹" + CURRENCY_FMT.format(order.getUnitPrice()) + "/kL";
            PdfPCell rateCell = new PdfPCell(new Phrase(rateStr, regularFont));
            rateCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rateCell.setPadding(8);
            rateCell.setBorderColor(BORDER_COLOR);
            itemTable.addCell(rateCell);

            String subtotalStr = "₹" + CURRENCY_FMT.format(invoice.getSubtotal());
            PdfPCell amtCell = new PdfPCell(new Phrase(subtotalStr, regularFont));
            amtCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            amtCell.setPadding(8);
            amtCell.setBorderColor(BORDER_COLOR);
            itemTable.addCell(amtCell);

            document.add(itemTable);

            // 4. Calculations Summary Table
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(45);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.setWidths(new float[]{55, 45});

            addSummaryRow(summaryTable, "Subtotal:", "₹" + CURRENCY_FMT.format(invoice.getSubtotal()), regularFont);
            if (invoice.getDiscount() != null && invoice.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
                addSummaryRow(summaryTable, "Discount:", "-₹" + CURRENCY_FMT.format(invoice.getDiscount()), regularFont);
            }
            if (invoice.getTax() != null && invoice.getTax().compareTo(BigDecimal.ZERO) > 0) {
                addSummaryRow(summaryTable, "GST / Tax:", "₹" + CURRENCY_FMT.format(invoice.getTax()), regularFont);
            }
            if (invoice.getDeliveryCharge() != null && invoice.getDeliveryCharge().compareTo(BigDecimal.ZERO) > 0) {
                addSummaryRow(summaryTable, "Delivery Charges:", "₹" + CURRENCY_FMT.format(invoice.getDeliveryCharge()), regularFont);
            }

            // Total Row
            PdfPCell totalLabelCell = new PdfPCell(new Phrase("Total Amount:", totalFont));
            totalLabelCell.setBackgroundColor(HEADER_BG);
            totalLabelCell.setPadding(8);
            totalLabelCell.setBorderColor(BORDER_COLOR);
            summaryTable.addCell(totalLabelCell);

            PdfPCell totalValCell = new PdfPCell(new Phrase("₹" + CURRENCY_FMT.format(invoice.getTotalAmount()), totalFont));
            totalValCell.setBackgroundColor(HEADER_BG);
            totalValCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalValCell.setPadding(8);
            totalValCell.setBorderColor(BORDER_COLOR);
            summaryTable.addCell(totalValCell);

            document.add(summaryTable);

            // 5. Notes & Footer
            document.add(new Paragraph(" "));
            Paragraph termsTitle = new Paragraph("Notes & Terms:", boldFont);
            document.add(termsTitle);

            Paragraph termsText = new Paragraph(
                    "1. This is a computer-generated invoice and requires no physical signature.\n" +
                    "2. Water delivery will be dispatched to the designated community tank / delivery address according to the scheduled tanker slot.\n" +
                    "3. For questions, meter discrepancies, or delivery support, contact support@aquaflow.org or your Community Administrator.",
                    FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_MUTED)
            );
            document.add(termsText);

            document.close();

            byte[] pdfBytes = baos.toByteArray();
            savePdfToDisk(invoice.getInvoiceNumber(), pdfBytes);
            return pdfBytes;

        } catch (Exception e) {
            log.error("Failed to generate PDF invoice for {}: {}", invoice.getInvoiceNumber(), e.getMessage(), e);
            throw new RuntimeException("Error generating PDF invoice: " + e.getMessage(), e);
        }
    }

    private void addSummaryRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell lCell = new PdfPCell(new Phrase(label, font));
        lCell.setBorderColor(BORDER_COLOR);
        lCell.setPadding(5);
        table.addCell(lCell);

        PdfPCell vCell = new PdfPCell(new Phrase(value, font));
        vCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        vCell.setBorderColor(BORDER_COLOR);
        vCell.setPadding(5);
        table.addCell(vCell);
    }

    public String savePdfToDisk(String invoiceNumber, byte[] pdfBytes) {
        try {
            Path directory = Paths.get(UPLOAD_DIR);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }
            String fileName = "invoice_" + invoiceNumber + ".pdf";
            Path filePath = directory.resolve(fileName);
            Files.write(filePath, pdfBytes);
            log.info("Saved invoice PDF to {}", filePath.toAbsolutePath());
            return filePath.toString();
        } catch (Exception e) {
            log.warn("Could not save PDF to disk (continuing with in-memory byte array): {}", e.getMessage());
            return null;
        }
    }

    public byte[] loadPdfFromDisk(String invoiceNumber) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR, "invoice_" + invoiceNumber + ".pdf");
            if (Files.exists(filePath)) {
                return Files.readAllBytes(filePath);
            }
        } catch (Exception e) {
            log.warn("Could not load PDF from disk for invoice {}: {}", invoiceNumber, e.getMessage());
        }
        return null;
    }
}
