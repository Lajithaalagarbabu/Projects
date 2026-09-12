package com.pgmanagement.dto;

import java.time.LocalDate;

public class ResidentDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String emergencyContact;
    private String address;
    private LocalDate joiningDate;
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private String status;
    private String outsideStatus;
    private String expectedReturnTime;
    private String password;

    public ResidentDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOutsideStatus() { return outsideStatus; }
    public void setOutsideStatus(String outsideStatus) { this.outsideStatus = outsideStatus; }

    public String getExpectedReturnTime() { return expectedReturnTime; }
    public void setExpectedReturnTime(String expectedReturnTime) { this.expectedReturnTime = expectedReturnTime; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
