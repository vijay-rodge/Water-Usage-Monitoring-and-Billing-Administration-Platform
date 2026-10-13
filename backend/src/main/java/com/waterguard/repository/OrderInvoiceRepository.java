package com.waterguard.repository;

import com.waterguard.model.OrderInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderInvoiceRepository extends JpaRepository<OrderInvoice, Long> {
    Optional<OrderInvoice> findByInvoiceNumber(String invoiceNumber);
    Optional<OrderInvoice> findByOrderId(Long orderId);
    List<OrderInvoice> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<OrderInvoice> findAllByOrderByCreatedAtDesc();
    boolean existsByOrderId(Long orderId);
}
