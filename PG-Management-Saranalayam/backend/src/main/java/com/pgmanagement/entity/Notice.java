package com.pgmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "notices")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String targetRole = "ALL"; // ALL, RESIDENT, HOUSEKEEPER

    private LocalDate postedDate = LocalDate.now();

    private String postedBy = "Hostel Admin";

    public Notice() {}

    public Notice(String title, String content, String targetRole, String postedBy) {
        this.title = title;
        this.content = content;
        this.targetRole = targetRole;
        this.postedDate = LocalDate.now();
        this.postedBy = postedBy != null ? postedBy : "Hostel Admin";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public LocalDate getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDate postedDate) { this.postedDate = postedDate; }

    public String getPostedBy() { return postedBy; }
    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }
}
