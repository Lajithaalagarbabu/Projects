package com.pgmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    @ManyToOne
    @JoinColumn(name = "electricity_bill_id", nullable = false)
    private ElectricityBill electricityBill;

    private double amount;

    private String paymentStatus = "UNPAID"; // UNPAID, PAID

    private LocalDate paymentDate;

    private String transactionRef;

    public Payment() {}

    public Payment(Resident resident, ElectricityBill electricityBill, double amount) {
        this.resident = resident;
        this.electricityBill = electricityBill;
        this.amount = amount;
        this.paymentStatus = "UNPAID";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Resident getResident() { return resident; }
    public void setResident(Resident resident) { this.resident = resident; }

    public ElectricityBill getElectricityBill() { return electricityBill; }
    public void setElectricityBill(ElectricityBill electricityBill) { this.electricityBill = electricityBill; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }
}
