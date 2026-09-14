package com.trizenai.photoshare.controller;

import com.trizenai.photoshare.dto.GalleryRequest;
import com.trizenai.photoshare.dto.GalleryResponse;
import com.trizenai.photoshare.security.SecurityUtils;
import com.trizenai.photoshare.service.GalleryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class GalleryController {

    private final GalleryService galleryService;
    private final SecurityUtils securityUtils;

    public GalleryController(GalleryService galleryService, SecurityUtils securityUtils) {
        this.galleryService = galleryService;
        this.securityUtils = securityUtils;
    }

    @PostMapping("/events/{eventId}/gallery")
    public ResponseEntity<GalleryResponse> createGallery(
            @PathVariable Long eventId,
            @Valid @RequestBody GalleryRequest request
    ) {
        Long adminId = securityUtils.getCurrentUserId();
        GalleryResponse gallery = galleryService.createGallery(eventId, request, adminId);
        return new ResponseEntity<>(gallery, HttpStatus.CREATED);
    }

    @GetMapping("/events/{eventId}/gallery")
    public ResponseEntity<GalleryResponse> getGalleryByEvent(@PathVariable Long eventId) {
        Long adminId = securityUtils.getCurrentUserId();
        GalleryResponse gallery = galleryService.getGalleryByEvent(eventId, adminId);
        return ResponseEntity.ok(gallery);
    }

    @PostMapping("/galleries/{galleryId}/publish")
    public ResponseEntity<GalleryResponse> publishGallery(@PathVariable Long galleryId) {
        Long adminId = securityUtils.getCurrentUserId();
        GalleryResponse gallery = galleryService.publishGallery(galleryId, adminId);
        return ResponseEntity.ok(gallery);
    }
}
