package com.waterguard.repository;

import com.waterguard.model.MeterReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeterReadingRepository extends JpaRepository<MeterReading, Long> {
    List<MeterReading> findByHouseholdIdOrderByReadingDateDesc(Long householdId);
    List<MeterReading> findByHouseholdIdAndReadingDateBetweenOrderByReadingDateAsc(Long householdId, LocalDate startDate, LocalDate endDate);
    Optional<MeterReading> findTopByHouseholdIdOrderByReadingDateDesc(Long householdId);

    @Query("SELECT r FROM MeterReading r WHERE r.household.apartment.id = :apartmentId ORDER BY r.readingDate DESC")
    List<MeterReading> findByApartmentId(@Param("apartmentId") Long apartmentId);

    @Query("SELECT COALESCE(SUM(r.dailyConsumptionLiters), 0) FROM MeterReading r WHERE r.household.id = :householdId AND r.readingDate BETWEEN :startDate AND :endDate")
    BigDecimal sumConsumptionByHouseholdAndDateRange(@Param("householdId") Long householdId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

