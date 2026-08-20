package com.phc.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "elderly_health_records")
public class ElderlyHealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private LocalDateTime recordDate;

    @Column(nullable = false)
    private Integer bloodPressureSys;

    @Column(nullable = false)
    private Integer bloodPressureDia;

    @Column(nullable = false)
    private Integer sugarFasting;

    @Column(nullable = false)
    private Integer sugarPostPrandial;

    @Column(nullable = false)
    private Integer heartRate;

    @Column(nullable = false)
    private Double weight;

    private String chronicDiseases;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public ElderlyHealthRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public LocalDateTime getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDateTime recordDate) { this.recordDate = recordDate; }
    public Integer getBloodPressureSys() { return bloodPressureSys; }
    public void setBloodPressureSys(Integer bloodPressureSys) { this.bloodPressureSys = bloodPressureSys; }
    public Integer getBloodPressureDia() { return bloodPressureDia; }
    public void setBloodPressureDia(Integer bloodPressureDia) { this.bloodPressureDia = bloodPressureDia; }
    public Integer getSugarFasting() { return sugarFasting; }
    public void setSugarFasting(Integer sugarFasting) { this.sugarFasting = sugarFasting; }
    public Integer getSugarPostPrandial() { return sugarPostPrandial; }
    public void setSugarPostPrandial(Integer sugarPostPrandial) { this.sugarPostPrandial = sugarPostPrandial; }
    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public String getChronicDiseases() { return chronicDiseases; }
    public void setChronicDiseases(String chronicDiseases) { this.chronicDiseases = chronicDiseases; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
