package com.waterguard.repository;

import com.waterguard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByApartmentId(Long apartmentId);
    Optional<User> findByApartmentIdAndRole(Long apartmentId, String role);
    Boolean existsByApartmentIdAndRole(Long apartmentId, String role);
    List<User> findByApartmentIdAndApprovalStatus(Long apartmentId, String approvalStatus);
    List<User> findByApartmentIdAndRoleAndApprovalStatus(Long apartmentId, String role, String approvalStatus);
}
