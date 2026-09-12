package com.pgmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "residents")
public class Resident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   @OneToOne(cascade = {CascadeType.MERGE, CascadeType.REFRESH})
   @JoinColumn(name = "user_id", referencedColumnName = "id")
   private User user;


    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String emergencyContact;

    private String address;

    private LocalDate joiningDate;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    private String status = "ACTIVE";

    private String outsideStatus = "INSIDE"; // INSIDE or OUTSIDE

    private String expectedReturnTime;

    public Resident() {}

    public Resident(User user, String fullName, String email, String phone, String emergencyContact, String address, LocalDate joiningDate, Room room) {
        this.user = user;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.emergencyContact = emergencyContact;
        this.address = address;
        this.joiningDate = joiningDate;
        this.room = room;
        this.status = "ACTIVE";
        this.outsideStatus = "INSIDE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOutsideStatus() { return outsideStatus; }
    public void setOutsideStatus(String outsideStatus) { this.outsideStatus = outsideStatus; }

    public String getExpectedReturnTime() { return expectedReturnTime; }
    public void setExpectedReturnTime(String expectedReturnTime) { this.expectedReturnTime = expectedReturnTime; }
}
