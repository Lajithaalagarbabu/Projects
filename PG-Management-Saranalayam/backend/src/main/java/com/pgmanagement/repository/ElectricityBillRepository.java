package com.pgmanagement.repository;

import com.pgmanagement.entity.ElectricityBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ElectricityBillRepository extends JpaRepository<ElectricityBill, Long> {
    Optional<ElectricityBill> findByBillingMonth(String billingMonth);
    Optional<ElectricityBill> findTopByOrderByIdDesc();
}
