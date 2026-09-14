package com.trizenai.photoshare.service;

import com.trizenai.photoshare.dto.GalleryRequest;
import com.trizenai.photoshare.dto.GalleryResponse;
import com.trizenai.photoshare.dto.PhotoResponse;
import com.trizenai.photoshare.dto.PinVerificationRequest;
import com.trizenai.photoshare.dto.PinVerificationResponse;
import com.trizenai.photoshare.entity.Event;
import com.trizenai.photoshare.entity.Gallery;
import com.trizenai.photoshare.entity.GalleryPhoto;
import com.trizenai.photoshare.entity.Photo;
import com.trizenai.photoshare.exception.BadRequestException;
import com.trizenai.photoshare.exception.ForbiddenException;
import com.trizenai.photoshare.exception.ResourceNotFoundException;
import com.trizenai.photoshare.exception.UnauthorizedException;
import com.trizenai.photoshare.repository.EventRepository;
import com.trizenai.photoshare.repository.GalleryPhotoRepository;
import com.trizenai.photoshare.repository.GalleryRepository;
import com.trizenai.photoshare.repository.PhotoRepository;
import com.trizenai.photoshare.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GalleryService {

    private final GalleryRepository galleryRepository;
    private final GalleryPhotoRepository galleryPhotoRepository;
    private final EventRepository eventRepository;
    private final PhotoRepository photoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final String ALPHANUMERIC = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public GalleryService(
            GalleryRepository galleryRepository,
            GalleryPhotoRepository galleryPhotoRepository,
            EventRepository eventRepository,
            PhotoRepository photoRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.galleryRepository = galleryRepository;
        this.galleryPhotoRepository = galleryPhotoRepository;
        this.eventRepository = eventRepository;
        this.photoRepository = photoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public GalleryResponse createGallery(Long eventId, GalleryRequest request, Long adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to create gallery for this event");
        }

        long selectedCount = photoRepository.countByEventIdAndSelected(eventId, true);
        if (selectedCount == 0) {
            throw new BadRequestException("Please select at least one photo before creating a gallery");
        }

        String pinHash = passwordEncoder.encode(request.getPin());

        Optional<Gallery> existingOpt = galleryRepository.findByEventId(eventId);
        Gallery gallery;

        if (existingOpt.isPresent()) {
            gallery = existingOpt.get();
            gallery.setPinHash(pinHash);
        } else {
            gallery = new Gallery();
            gallery.setEventId(eventId);
            gallery.setGalleryCode(generateUniqueGalleryCode());
            gallery.setPinHash(pinHash);
            gallery.setPublished(false);
        }

        Gallery savedGallery = galleryRepository.save(gallery);

        // Sync selected photos
        syncGalleryPhotos(savedGallery.getId(), eventId);

        return mapToGalleryResponse(savedGallery, event);
    }

    @Transactional
    public GalleryResponse publishGallery(Long galleryId, Long adminId) {
        Gallery gallery = galleryRepository.findById(galleryId)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery not found with id: " + galleryId));

        Event event = eventRepository.findById(gallery.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Associated event not found"));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to publish this gallery");
        }

        gallery.setPublished(true);
        gallery.setPublishedAt(LocalDateTime.now());
        Gallery publishedGallery = galleryRepository.save(gallery);

        // Ensure selected photos are attached
        syncGalleryPhotos(publishedGallery.getId(), event.getId());

        return mapToGalleryResponse(publishedGallery, event);
    }

    public GalleryResponse getGalleryByEvent(Long eventId, Long adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to view gallery for this event");
        }

        Gallery gallery = galleryRepository.findByEventId(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery has not been created for this event yet"));

        return mapToGalleryResponse(gallery, event);
    }

    public PinVerificationResponse verifyGalleryPin(String galleryCode, PinVerificationRequest request) {
        Gallery gallery = galleryRepository.findByGalleryCode(galleryCode)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid gallery code"));

        if (!gallery.isPublished()) {
            throw new ForbiddenException("This gallery is not published yet");
        }

        if (!passwordEncoder.matches(request.getPin(), gallery.getPinHash())) {
            throw new UnauthorizedException("Incorrect PIN. Access denied.");
        }

        Event event = eventRepository.findById(gallery.getEventId()).orElse(null);
        String eventName = event != null ? event.getName() : "Event Gallery";
        long photoCount = photoRepository.findByGalleryId(gallery.getId()).stream().filter(Photo::isSelected).count();

        String token = jwtService.generateGalleryAccessToken(galleryCode);

        return new PinVerificationResponse(
                true,
                token,
                eventName,
                photoCount,
                "PIN verified successfully"
        );
    }

    public List<PhotoResponse> getPublicGalleryPhotos(String galleryCode, String token) {
        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Gallery access token required. Please verify PIN first.");
        }

        String bearerToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        if (!jwtService.isGalleryTokenValid(bearerToken, galleryCode)) {
            throw new UnauthorizedException("Invalid or expired gallery access session. Please enter PIN again.");
        }

        Gallery gallery = galleryRepository.findByGalleryCode(galleryCode)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid gallery code"));

        if (!gallery.isPublished()) {
            throw new ForbiddenException("This gallery is not published yet");
        }

        List<Photo> photos = photoRepository.findByGalleryId(gallery.getId());
        return photos.stream()
                .filter(Photo::isSelected)
                .map(p -> new PhotoResponse(
                        p.getId(),
                        p.getEventId(),
                        p.getUploadedBy(),
                        "Studio Team",
                        p.getFilename(),
                        p.getStorageUrl(),
                        p.getStoragePublicId(),
                        p.getFileSize(),
                        p.isSelected(),
                        p.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public GalleryResponse getPublicGalleryInfo(String galleryCode) {
        Gallery gallery = galleryRepository.findByGalleryCode(galleryCode)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid gallery code"));

        if (!gallery.isPublished()) {
            throw new ForbiddenException("This gallery is not published yet");
        }

        Event event = eventRepository.findById(gallery.getEventId()).orElse(null);
        return mapToGalleryResponse(gallery, event);
    }

    private void syncGalleryPhotos(Long galleryId, Long eventId) {
        galleryPhotoRepository.deleteByGalleryId(galleryId);
        List<Photo> selectedPhotos = photoRepository.findByEventIdAndSelected(eventId, true);
        for (Photo p : selectedPhotos) {
            galleryPhotoRepository.save(new GalleryPhoto(galleryId, p.getId()));
        }
    }

    private String generateUniqueGalleryCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(9);
            for (int i = 0; i < 9; i++) {
                sb.append(ALPHANUMERIC.charAt(RANDOM.nextInt(ALPHANUMERIC.length())));
            }
            code = sb.toString();
        } while (galleryRepository.existsByGalleryCode(code));
        return code;
    }

    private GalleryResponse mapToGalleryResponse(Gallery gallery, Event event) {
        long totalPhotos = photoRepository.countByEventId(gallery.getEventId());
        long selectedPhotos = photoRepository.countByEventIdAndSelected(gallery.getEventId(), true);
        String eventName = event != null ? event.getName() : "Event";
        String galleryUrl = "/gallery/" + gallery.getGalleryCode();

        return new GalleryResponse(
                gallery.getId(),
                gallery.getEventId(),
                eventName,
                gallery.getGalleryCode(),
                gallery.isPublished(),
                gallery.getPublishedAt(),
                gallery.getCreatedAt(),
                totalPhotos,
                selectedPhotos,
                galleryUrl
        );
    }
}
