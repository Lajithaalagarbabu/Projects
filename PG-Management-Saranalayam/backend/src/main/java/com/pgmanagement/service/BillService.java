package com.pgmanagement.service;

import com.pgmanagement.entity.ElectricityBill;
import com.pgmanagement.entity.Payment;
import com.pgmanagement.entity.Resident;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.repository.ElectricityBillRepository;
import com.pgmanagement.repository.PaymentRepository;
import com.pgmanagement.repository.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private ElectricityBillRepository electricityBillRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ResidentRepository residentRepository;

    @Transactional
    public ElectricityBill createMonthlyBill(String billingMonth, double totalAmount) {
        List<Resident> activeResidents = residentRepository.findByStatus("ACTIVE");
        int activeCount = activeResidents.size();

        if (activeCount == 0) {
            throw new IllegalStateException("Cannot create electricity bill: No active residents found in hostel.");
        }

        double sharePerResident = totalAmount / activeCount;
        // Round to 2 decimal places
        sharePerResident = Math.round(sharePerResident * 100.0) / 100.0;

        ElectricityBill bill = new ElectricityBill(billingMonth, totalAmount, activeCount, sharePerResident);
        ElectricityBill savedBill = electricityBillRepository.save(bill);

        // Create UNPAID payment record for every active resident
        for (Resident resident : activeResidents) {
            Payment payment = new Payment(resident, savedBill, sharePerResident);
            paymentRepository.save(payment);
        }

        return savedBill;
    }

    public List<ElectricityBill> getAllBills() {
        return electricityBillRepository.findAll();
    }

    public ElectricityBill getLatestBill() {
        return electricityBillRepository.findTopByOrderByIdDesc().orElse(null);
    }

    public List<Payment> getPaymentsByBill(Long billId) {
        return paymentRepository.findByElectricityBillId(billId);
    }

    public List<Payment> getPaymentsByResident(Long residentId) {
        return paymentRepository.findByResidentId(residentId);
    }

    public Optional<Payment> getResidentCurrentPayment(Long residentId, Long billId) {
        if (billId != null) {
            return paymentRepository.findByResidentIdAndElectricityBillId(residentId, billId);
        }
        ElectricityBill latest = getLatestBill();
        if (latest == null) return Optional.empty();
        return paymentRepository.findByResidentIdAndElectricityBillId(residentId, latest.getId());
    }

    @Transactional
    public Payment processPayment(Long paymentId, String transactionRef) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found with id: " + paymentId));

        payment.setPaymentStatus("PAID");
        payment.setPaymentDate(LocalDate.now());
        payment.setTransactionRef(transactionRef != null ? transactionRef : "PAY-ONLINE-" + System.currentTimeMillis());

        return paymentRepository.save(payment);
    }
}
