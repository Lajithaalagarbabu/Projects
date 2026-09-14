package com.trizenai.photoshare.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EventResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDate eventDate;
    private Long createdBy;
    private String createdByName;
    private LocalDateTime createdAt;
    private long totalPhotos;
    private long selectedPhotos;
    private long teamMembersCount;
    private String galleryCode;
    private Boolean galleryPublished;

    public EventResponse() {
    }

    public EventResponse(Long id, String name, String description, LocalDate eventDate, Long createdBy, String createdByName, LocalDateTime createdAt, long totalPhotos, long selectedPhotos, long teamMembersCount, String galleryCode, Boolean galleryPublished) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.eventDate = eventDate;
        this.createdBy = createdBy;
        this.createdByName = createdByName;
        this.createdAt = createdAt;
        this.totalPhotos = totalPhotos;
        this.selectedPhotos = selectedPhotos;
        this.teamMembersCount = teamMembersCount;
        this.galleryCode = galleryCode;
        this.galleryPublished = galleryPublished;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getTotalPhotos() {
        return totalPhotos;
    }

    public void setTotalPhotos(long totalPhotos) {
        this.totalPhotos = totalPhotos;
    }

    public long getSelectedPhotos() {
        return selectedPhotos;
    }

    public void setSelectedPhotos(long selectedPhotos) {
        this.selectedPhotos = selectedPhotos;
    }

    public long getTeamMembersCount() {
        return teamMembersCount;
    }

    public void setTeamMembersCount(long teamMembersCount) {
        this.teamMembersCount = teamMembersCount;
    }

    public String getGalleryCode() {
        return galleryCode;
    }

    public void setGalleryCode(String galleryCode) {
        this.galleryCode = galleryCode;
    }

    public Boolean getGalleryPublished() {
        return galleryPublished;
    }

    public void setGalleryPublished(Boolean galleryPublished) {
        this.galleryPublished = galleryPublished;
    }
}
