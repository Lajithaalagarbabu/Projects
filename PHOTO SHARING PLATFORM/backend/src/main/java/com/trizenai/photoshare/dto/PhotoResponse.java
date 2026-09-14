package com.trizenai.photoshare.dto;

import java.time.LocalDateTime;

public class PhotoResponse {

    private Long id;
    private Long eventId;
    private Long uploadedBy;
    private String uploadedByName;
    private String filename;
    private String storageUrl;
    private String storagePublicId;
    private Long fileSize;
    private boolean selected;
    private LocalDateTime createdAt;

    public PhotoResponse() {
    }

    public PhotoResponse(Long id, Long eventId, Long uploadedBy, String uploadedByName, String filename, String storageUrl, String storagePublicId, Long fileSize, boolean selected, LocalDateTime createdAt) {
        this.id = id;
        this.eventId = eventId;
        this.uploadedBy = uploadedBy;
        this.uploadedByName = uploadedByName;
        this.filename = filename;
        this.storageUrl = storageUrl;
        this.storagePublicId = storagePublicId;
        this.fileSize = fileSize;
        this.selected = selected;
        this.createdAt = createdAt;
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

    public String getUploadedByName() {
        return uploadedByName;
    }

    public void setUploadedByName(String uploadedByName) {
        this.uploadedByName = uploadedByName;
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
