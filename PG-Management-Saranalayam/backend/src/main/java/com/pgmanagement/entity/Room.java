package com.pgmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomNumber;

    private boolean isAc;

    private int sharingType;

    private int totalCapacity;

    private int occupiedBeds = 0;

    private double monthlyRent;

    public Room() {}

    public Room(String roomNumber, boolean isAc, int sharingType, int totalCapacity, double monthlyRent) {
        this.roomNumber = roomNumber;
        this.isAc = isAc;
        this.sharingType = sharingType;
        this.totalCapacity = totalCapacity;
        this.occupiedBeds = 0;
        this.monthlyRent = monthlyRent;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public boolean isAc() { return isAc; }
    public void setAc(boolean ac) { isAc = ac; }

    public int getSharingType() { return sharingType; }
    public void setSharingType(int sharingType) { this.sharingType = sharingType; }

    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }

    public int getOccupiedBeds() { return occupiedBeds; }
    public void setOccupiedBeds(int occupiedBeds) { this.occupiedBeds = occupiedBeds; }

    public int getAvailableBeds() { return Math.max(0, totalCapacity - occupiedBeds); }

    public double getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(double monthlyRent) { this.monthlyRent = monthlyRent; }
}
