package com.waterguard.repository;

import com.waterguard.model.WaterOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WaterOrderRepository extends JpaRepository<WaterOrder, Long> {
    Optional<WaterOrder> findByOrderNumber(String orderNumber);
    List<WaterOrder> findByUserIdOrderByOrderDateDesc(Long userId);
    List<WaterOrder> findByApartmentIdOrderByOrderDateDesc(Long apartmentId);
    List<WaterOrder> findAllByOrderByOrderDateDesc();
}
