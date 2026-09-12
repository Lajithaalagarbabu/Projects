package com.pgmanagement.repository;

import com.pgmanagement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByResidentId(Long residentId);
    List<Payment> findByElectricityBillId(Long electricityBillId);
    Optional<Payment> findByResidentIdAndElectricityBillId(Long residentId, Long electricityBillId);
    long countByElectricityBillIdAndPaymentStatus(Long electricityBillId, String paymentStatus);
}
