package com.pgmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "access_records")
public class AccessRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    private LocalDate date;

    private String entryTime;

    private String exitTime;

    private String accessType = "FINGERPRINT_DOOR_SCAN";

    private String status = "GRANTED";

    public AccessRecord() {}

    public AccessRecord(Resident resident, LocalDate date, String entryTime, String exitTime, String accessType, String status) {
        this.resident = resident;
        this.date = date;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.accessType = accessType;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Resident getResident() { return resident; }
    public void setResident(Resident resident) { this.resident = resident; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getEntryTime() { return entryTime; }
    public void setEntryTime(String entryTime) { this.entryTime = entryTime; }

    public String getExitTime() { return exitTime; }
    public void setExitTime(String exitTime) { this.exitTime = exitTime; }

    public String getAccessType() { return accessType; }
    public void setAccessType(String accessType) { this.accessType = accessType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
