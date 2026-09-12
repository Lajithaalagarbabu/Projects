package com.pgmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "electricity_bills")
public class ElectricityBill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String billingMonth; // e.g. "August 2026"

    private double totalAmount;

    private int activeResidentsCount;

    private double sharePerResident;

    private LocalDate createdDate = LocalDate.now();

    public ElectricityBill() {}

    public ElectricityBill(String billingMonth, double totalAmount, int activeResidentsCount, double sharePerResident) {
        this.billingMonth = billingMonth;
        this.totalAmount = totalAmount;
        this.activeResidentsCount = activeResidentsCount;
        this.sharePerResident = sharePerResident;
        this.createdDate = LocalDate.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBillingMonth() { return billingMonth; }
    public void setBillingMonth(String billingMonth) { this.billingMonth = billingMonth; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public int getActiveResidentsCount() { return activeResidentsCount; }
    public void setActiveResidentsCount(int activeResidentsCount) { this.activeResidentsCount = activeResidentsCount; }

    public double getSharePerResident() { return sharePerResident; }
    public void setSharePerResident(double sharePerResident) { this.sharePerResident = sharePerResident; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
}
