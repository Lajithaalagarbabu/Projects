package com.pgmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "housekeepers")
public class Housekeeper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;


    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    private String assignedResponsibility;

    private String workingStatus = "ACTIVE";

    public Housekeeper() {}

    public Housekeeper(User user, String name, String phone, String assignedResponsibility) {
        this.user = user;
        this.name = name;
        this.phone = phone;
        this.assignedResponsibility = assignedResponsibility;
        this.workingStatus = "ACTIVE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAssignedResponsibility() { return assignedResponsibility; }
    public void setAssignedResponsibility(String assignedResponsibility) { this.assignedResponsibility = assignedResponsibility; }

    public String getWorkingStatus() { return workingStatus; }
    public void setWorkingStatus(String workingStatus) { this.workingStatus = workingStatus; }
}
