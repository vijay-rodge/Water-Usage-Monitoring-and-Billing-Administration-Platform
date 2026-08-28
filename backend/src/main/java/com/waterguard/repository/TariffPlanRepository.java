package com.waterguard.repository;

import com.waterguard.model.TariffPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TariffPlanRepository extends JpaRepository<TariffPlan, Long> {
    List<TariffPlan> findByApartmentIdOrderByEffectiveFromDesc(Long apartmentId);
    Optional<TariffPlan> findFirstByApartmentIdAndIsActiveTrueOrderByEffectiveFromDesc(Long apartmentId);
}

