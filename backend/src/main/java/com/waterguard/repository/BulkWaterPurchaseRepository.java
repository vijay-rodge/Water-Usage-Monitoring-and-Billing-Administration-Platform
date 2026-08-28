package com.waterguard.repository;

import com.waterguard.model.BulkWaterPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BulkWaterPurchaseRepository extends JpaRepository<BulkWaterPurchase, Long> {
    List<BulkWaterPurchase> findByApartmentIdOrderByPurchaseDateDesc(Long apartmentId);

    @Query("SELECT COALESCE(SUM(b.totalCost), 0) FROM BulkWaterPurchase b WHERE b.apartment.id = :apartmentId AND b.purchaseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumCostByApartmentAndDateRange(@Param("apartmentId") Long apartmentId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

