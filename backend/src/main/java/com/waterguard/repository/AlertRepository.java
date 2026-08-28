package com.waterguard.repository;

import com.waterguard.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByApartmentIdOrderByCreatedAtDesc(Long apartmentId);
    List<Alert> findByHouseholdIdOrderByCreatedAtDesc(Long householdId);
}

