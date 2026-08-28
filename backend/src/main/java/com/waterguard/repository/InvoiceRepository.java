package com.waterguard.repository;

import com.waterguard.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByHouseholdIdOrderByCreatedAtDesc(Long householdId);
    List<Invoice> findByHouseholdIdOrderByDueDateDesc(Long householdId);

    @Query("SELECT i FROM Invoice i WHERE i.household.apartment.id = :apartmentId ORDER BY i.createdAt DESC")
    List<Invoice> findByApartmentId(@Param("apartmentId") Long apartmentId);
}

