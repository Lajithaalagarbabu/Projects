package com.pgmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "late_arrival_requests")
public class LateArrivalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "resident_id", nullable = false)
    private Resident resident;

    private LocalDate date;

    private String expectedArrivalTime;

    private String reason;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    private LocalDateTime createdAt = LocalDateTime.now();

    public LateArrivalRequest() {}

    public LateArrivalRequest(Resident resident, LocalDate date, String expectedArrivalTime, String reason, String message) {
        this.resident = resident;
        this.date = date;
        this.expectedArrivalTime = expectedArrivalTime;
        this.reason = reason;
        this.message = message;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Resident getResident() { return resident; }
    public void setResident(Resident resident) { this.resident = resident; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getExpectedArrivalTime() { return expectedArrivalTime; }
    public void setExpectedArrivalTime(String expectedArrivalTime) { this.expectedArrivalTime = expectedArrivalTime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
