package com.pgmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "housekeeper_tasks")
public class HousekeeperTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "housekeeper_id", nullable = false)
    private Housekeeper housekeeper;

    @Column(nullable = false)
    private String taskDescription;

    private String roomNumber;

    private LocalDate assignedDate = LocalDate.now();

    private String status = "PENDING"; // PENDING, COMPLETED

    public HousekeeperTask() {}

    public HousekeeperTask(Housekeeper housekeeper, String taskDescription, String roomNumber) {
        this.housekeeper = housekeeper;
        this.taskDescription = taskDescription;
        this.roomNumber = roomNumber;
        this.assignedDate = LocalDate.now();
        this.status = "PENDING";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Housekeeper getHousekeeper() { return housekeeper; }
    public void setHousekeeper(Housekeeper housekeeper) { this.housekeeper = housekeeper; }

    public String getTaskDescription() { return taskDescription; }
    public void setTaskDescription(String taskDescription) { this.taskDescription = taskDescription; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public LocalDate getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDate assignedDate) { this.assignedDate = assignedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
