package com.trizenai.photoshare.dto;

import java.time.LocalDateTime;

public class GalleryResponse {

    private Long id;
    private Long eventId;
    private String eventName;
    private String galleryCode;
    private boolean published;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private long totalPhotos;
    private long selectedPhotos;
    private String galleryUrl;

    public GalleryResponse() {
    }

    public GalleryResponse(Long id, Long eventId, String eventName, String galleryCode, boolean published, LocalDateTime publishedAt, LocalDateTime createdAt, long totalPhotos, long selectedPhotos, String galleryUrl) {
        this.id = id;
        this.eventId = eventId;
        this.eventName = eventName;
        this.galleryCode = galleryCode;
        this.published = published;
        this.publishedAt = publishedAt;
        this.createdAt = createdAt;
        this.totalPhotos = totalPhotos;
        this.selectedPhotos = selectedPhotos;
        this.galleryUrl = galleryUrl;
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

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getGalleryCode() {
        return galleryCode;
    }

    public void setGalleryCode(String galleryCode) {
        this.galleryCode = galleryCode;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
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

    public String getGalleryUrl() {
        return galleryUrl;
    }

    public void setGalleryUrl(String galleryUrl) {
        this.galleryUrl = galleryUrl;
    }
}
