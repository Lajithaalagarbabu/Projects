package com.trizenai.photoshare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "uploaded_by", nullable = false)
    private Long uploadedBy;

    @Column(nullable = false)
    private String filename;

    @Column(name = "storage_url", nullable = false, length = 1000)
    private String storageUrl;

    @Column(name = "storage_public_id")
    private String storagePublicId;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(nullable = false)
    private boolean selected = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Photo() {
    }

    public Photo(Long id, Long eventId, Long uploadedBy, String filename, String storageUrl, String storagePublicId, Long fileSize, boolean selected, LocalDateTime createdAt) {
        this.id = id;
        this.eventId = eventId;
        this.uploadedBy = uploadedBy;
        this.filename = filename;
        this.storageUrl = storageUrl;
        this.storagePublicId = storagePublicId;
        this.fileSize = fileSize;
        this.selected = selected;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(Long uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getStorageUrl() {
        return storageUrl;
    }

    public void setStorageUrl(String storageUrl) {
        this.storageUrl = storageUrl;
    }

    public String getStoragePublicId() {
        return storagePublicId;
    }

    public void setStoragePublicId(String storagePublicId) {
        this.storagePublicId = storagePublicId;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
