package com.phc.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "pregnancy_records")
public class PregnancyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private LocalDate registrationDate;

    @Column(nullable = false)
    private LocalDate edd;

    @Column(nullable = false)
    private LocalDate lmpDate;

    @Column(nullable = false, length = 20)
    private String bloodPressure;

    @Column(nullable = false)
    private Double hemoglobin;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private Boolean highRiskStatus = false;

    private String highRiskReason;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public PregnancyRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public LocalDate getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDate registrationDate) { this.registrationDate = registrationDate; }
    public LocalDate getEdd() { return edd; }
    public void setEdd(LocalDate edd) { this.edd = edd; }
    public LocalDate getLmpDate() { return lmpDate; }
    public void setLmpDate(LocalDate lmpDate) { this.lmpDate = lmpDate; }
    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }
    public Double getHemoglobin() { return hemoglobin; }
    public void setHemoglobin(Double hemoglobin) { this.hemoglobin = hemoglobin; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Boolean getHighRiskStatus() { return highRiskStatus; }
    public void setHighRiskStatus(Boolean highRiskStatus) { this.highRiskStatus = highRiskStatus; }
    public String getHighRiskReason() { return highRiskReason; }
    public void setHighRiskReason(String highRiskReason) { this.highRiskReason = highRiskReason; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
