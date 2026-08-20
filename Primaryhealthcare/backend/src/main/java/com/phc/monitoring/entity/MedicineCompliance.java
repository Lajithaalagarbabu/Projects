package com.phc.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicine_compliance")
public class MedicineCompliance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime reminderTime;

    @Column(nullable = false, length = 20)
    private String status; // TAKEN, SKIPPED, SNOOZED

    private LocalDateTime actionTime;

    public MedicineCompliance() {}

    public MedicineCompliance(Long id, Patient patient, Prescription prescription, LocalDate date, LocalTime reminderTime, String status, LocalDateTime actionTime) {
        this.id = id;
        this.patient = patient;
        this.prescription = prescription;
        this.date = date;
        this.reminderTime = reminderTime;
        this.status = status;
        this.actionTime = actionTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getReminderTime() { return reminderTime; }
    public void setReminderTime(LocalTime reminderTime) { this.reminderTime = reminderTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getActionTime() { return actionTime; }
    public void setActionTime(LocalDateTime actionTime) { this.actionTime = actionTime; }
}
