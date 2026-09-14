package com.trizenai.photoshare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "gallery_photos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"gallery_id", "photo_id"})
})
public class GalleryPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gallery_id", nullable = false)
    private Long galleryId;

    @Column(name = "photo_id", nullable = false)
    private Long photoId;

    public GalleryPhoto() {
    }

    public GalleryPhoto(Long galleryId, Long photoId) {
        this.galleryId = galleryId;
        this.photoId = photoId;
    }

    public GalleryPhoto(Long id, Long galleryId, Long photoId) {
        this.id = id;
        this.galleryId = galleryId;
        this.photoId = photoId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGalleryId() {
        return galleryId;
    }

    public void setGalleryId(Long galleryId) {
        this.galleryId = galleryId;
    }

    public Long getPhotoId() {
        return photoId;
    }

    public void setPhotoId(Long photoId) {
        this.photoId = photoId;
    }
}
