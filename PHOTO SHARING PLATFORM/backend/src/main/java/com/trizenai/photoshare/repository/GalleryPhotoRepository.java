package com.trizenai.photoshare.repository;

import com.trizenai.photoshare.entity.GalleryPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryPhotoRepository extends JpaRepository<GalleryPhoto, Long> {
    List<GalleryPhoto> findByGalleryId(Long galleryId);
    void deleteByGalleryId(Long galleryId);
}
