package com.trizenai.photoshare.controller;

import com.trizenai.photoshare.dto.PhotoResponse;
import com.trizenai.photoshare.enums.Role;
import com.trizenai.photoshare.security.SecurityUtils;
import com.trizenai.photoshare.service.PhotoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class PhotoController {

    private final PhotoService photoService;
    private final SecurityUtils securityUtils;

    public PhotoController(PhotoService photoService, SecurityUtils securityUtils) {
        this.photoService = photoService;
        this.securityUtils = securityUtils;
    }

    @PostMapping(value = "/api/events/{eventId}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<PhotoResponse>> uploadPhotos(
            @PathVariable Long eventId,
            @RequestParam("photos") List<MultipartFile> photos
    ) {
        Long userId = securityUtils.getCurrentUserId();
        Role userRole = securityUtils.getCurrentUserRole();
        List<PhotoResponse> uploaded = photoService.uploadPhotos(eventId, photos, userId, userRole);
        return new ResponseEntity<>(uploaded, HttpStatus.CREATED);
    }

    @GetMapping("/api/admin/events/{eventId}/photos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PhotoResponse>> getAdminPhotos(@PathVariable Long eventId) {
        Long adminId = securityUtils.getCurrentUserId();
        List<PhotoResponse> photos = photoService.getPhotosForAdmin(eventId, adminId);
        return ResponseEntity.ok(photos);
    }

    @PutMapping("/api/admin/photos/{photoId}/select")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhotoResponse> togglePhotoSelection(@PathVariable Long photoId) {
        Long adminId = securityUtils.getCurrentUserId();
        Role userRole = securityUtils.getCurrentUserRole();
        PhotoResponse photo = photoService.togglePhotoSelection(photoId, adminId, userRole);
        return ResponseEntity.ok(photo);
    }

    @GetMapping("/api/team/events/{eventId}/photos")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER', 'ADMIN')")
    public ResponseEntity<List<PhotoResponse>> getTeamMemberEventPhotos(@PathVariable Long eventId) {
        Long userId = securityUtils.getCurrentUserId();
        List<PhotoResponse> photos = photoService.getPhotosForTeamMember(eventId, userId);
        return ResponseEntity.ok(photos);
    }

    @GetMapping("/api/team/photos/my")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER', 'ADMIN')")
    public ResponseEntity<List<PhotoResponse>> getMyUploadedPhotos() {
        Long userId = securityUtils.getCurrentUserId();
        List<PhotoResponse> photos = photoService.getMyUploadedPhotos(userId);
        return ResponseEntity.ok(photos);
    }
}
