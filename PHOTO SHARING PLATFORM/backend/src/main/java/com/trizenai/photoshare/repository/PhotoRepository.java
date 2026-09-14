package com.trizenai.photoshare.repository;

import com.trizenai.photoshare.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByEventId(Long eventId);
    List<Photo> findByEventIdAndUploadedBy(Long eventId, Long uploadedBy);
    List<Photo> findByUploadedBy(Long uploadedBy);
    List<Photo> findByEventIdAndSelected(Long eventId, boolean selected);
    long countByEventId(Long eventId);
    long countByEventIdAndSelected(Long eventId, boolean selected);

    @Query("SELECT p FROM Photo p WHERE p.id IN (SELECT gp.photoId FROM GalleryPhoto gp WHERE gp.galleryId = :galleryId)")
    List<Photo> findByGalleryId(@Param("galleryId") Long galleryId);
}
