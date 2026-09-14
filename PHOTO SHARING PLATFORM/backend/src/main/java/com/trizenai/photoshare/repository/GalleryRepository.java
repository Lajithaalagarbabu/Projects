package com.trizenai.photoshare.repository;

import com.trizenai.photoshare.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long> {
    Optional<Gallery> findByEventId(Long eventId);
    Optional<Gallery> findByGalleryCode(String galleryCode);
    boolean existsByGalleryCode(String galleryCode);
    boolean existsByEventId(Long eventId);
}
