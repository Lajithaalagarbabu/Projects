package com.trizenai.photoshare.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "galleries")
public class Gallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "gallery_code", nullable = false, unique = true)
    private String galleryCode;

    @Column(name = "pin_hash", nullable = false)
    private String pinHash;

    @Column(nullable = false)
    private boolean published = false;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Gallery() {
    }

    public Gallery(Long id, Long eventId, String galleryCode, String pinHash, boolean published, LocalDateTime publishedAt, LocalDateTime createdAt) {
        this.id = id;
        this.eventId = eventId;
        this.galleryCode = galleryCode;
        this.pinHash = pinHash;
        this.published = published;
        this.publishedAt = publishedAt;
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

    public String getGalleryCode() {
        return galleryCode;
    }

    public void setGalleryCode(String galleryCode) {
        this.galleryCode = galleryCode;
    }

    public String getPinHash() {
        return pinHash;
    }

    public void setPinHash(String pinHash) {
        this.pinHash = pinHash;
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
}
