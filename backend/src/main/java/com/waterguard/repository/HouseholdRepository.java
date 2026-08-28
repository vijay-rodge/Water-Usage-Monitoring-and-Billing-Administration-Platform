package com.waterguard.repository;

import com.waterguard.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, Long> {
    List<Household> findByApartmentId(Long apartmentId);
    Optional<Household> findByApartmentIdAndFlatNo(Long apartmentId, String flatNo);
    Optional<Household> findByMeterSerialNo(String meterSerialNo);
}
