package com.trizenai.photoshare.controller;

import com.trizenai.photoshare.dto.GalleryResponse;
import com.trizenai.photoshare.dto.PhotoResponse;
import com.trizenai.photoshare.dto.PinVerificationRequest;
import com.trizenai.photoshare.dto.PinVerificationResponse;
import com.trizenai.photoshare.service.GalleryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/gallery")
public class PublicGalleryController {

    private final GalleryService galleryService;

    public PublicGalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @GetMapping("/{galleryCode}")
    public ResponseEntity<GalleryResponse> getPublicGalleryInfo(@PathVariable String galleryCode) {
        GalleryResponse gallery = galleryService.getPublicGalleryInfo(galleryCode);
        return ResponseEntity.ok(gallery);
    }

    @PostMapping("/{galleryCode}/verify")
    public ResponseEntity<PinVerificationResponse> verifyGalleryPin(
            @PathVariable String galleryCode,
            @Valid @RequestBody PinVerificationRequest request
    ) {
        PinVerificationResponse response = galleryService.verifyGalleryPin(galleryCode, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{galleryCode}/photos")
    public ResponseEntity<List<PhotoResponse>> getPublicGalleryPhotos(
            @PathVariable String galleryCode,
            @RequestHeader(value = "X-Gallery-Token", required = false) String headerToken,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "token", required = false) String queryToken
    ) {
        String token = headerToken;
        if (token == null || token.isBlank()) {
            token = authHeader;
        }
        if (token == null || token.isBlank()) {
            token = queryToken;
        }

        List<PhotoResponse> photos = galleryService.getPublicGalleryPhotos(galleryCode, token);
        return ResponseEntity.ok(photos);
    }
}
