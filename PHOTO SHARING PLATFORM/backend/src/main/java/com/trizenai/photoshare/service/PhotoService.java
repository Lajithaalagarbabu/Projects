package com.trizenai.photoshare.service;

import com.trizenai.photoshare.dto.PhotoResponse;
import com.trizenai.photoshare.entity.Event;
import com.trizenai.photoshare.entity.Photo;
import com.trizenai.photoshare.entity.User;
import com.trizenai.photoshare.enums.Role;
import com.trizenai.photoshare.exception.BadRequestException;
import com.trizenai.photoshare.exception.ForbiddenException;
import com.trizenai.photoshare.exception.ResourceNotFoundException;
import com.trizenai.photoshare.repository.EventMemberRepository;
import com.trizenai.photoshare.repository.EventRepository;
import com.trizenai.photoshare.repository.PhotoRepository;
import com.trizenai.photoshare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public PhotoService(
            PhotoRepository photoRepository,
            EventRepository eventRepository,
            EventMemberRepository eventMemberRepository,
            UserRepository userRepository,
            CloudinaryService cloudinaryService
    ) {
        this.photoRepository = photoRepository;
        this.eventRepository = eventRepository;
        this.eventMemberRepository = eventMemberRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Transactional
    public List<PhotoResponse> uploadPhotos(Long eventId, List<MultipartFile> files, Long uploaderUserId, Role userRole) {
        if (files == null || files.isEmpty()) {
            throw new BadRequestException("At least one photo file must be provided");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (userRole == Role.ADMIN) {
            if (!event.getCreatedBy().equals(uploaderUserId)) {
                throw new ForbiddenException("You do not own this event");
            }
        } else if (userRole == Role.TEAM_MEMBER) {
            if (!eventMemberRepository.existsByEventIdAndUserId(eventId, uploaderUserId)) {
                throw new ForbiddenException("You are not assigned to this event");
            }
        } else {
            throw new ForbiddenException("Unauthorized role for photo upload");
        }

        User uploader = userRepository.findById(uploaderUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Uploader user not found"));

        List<PhotoResponse> uploadedResponses = new ArrayList<>();

        for (MultipartFile file : files) {
            Map<String, String> uploadResult = cloudinaryService.uploadFile(file);

            Photo photo = new Photo();
            photo.setEventId(eventId);
            photo.setUploadedBy(uploaderUserId);
            photo.setFilename(file.getOriginalFilename() != null ? file.getOriginalFilename() : "photo.jpg");
            photo.setStorageUrl(uploadResult.get("url"));
            photo.setStoragePublicId(uploadResult.get("publicId"));
            photo.setFileSize(file.getSize());
            photo.setSelected(false);

            Photo savedPhoto = photoRepository.save(photo);

            uploadedResponses.add(mapToPhotoResponse(savedPhoto, uploader.getName()));
        }

        return uploadedResponses;
    }

    public List<PhotoResponse> getPhotosForAdmin(Long eventId, Long adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to view photos for this event");
        }

        List<Photo> photos = photoRepository.findByEventId(eventId);
        return photos.stream()
                .map(p -> {
                    User uploader = userRepository.findById(p.getUploadedBy()).orElse(null);
                    String uploaderName = uploader != null ? uploader.getName() : "Unknown User";
                    return mapToPhotoResponse(p, uploaderName);
                })
                .collect(Collectors.toList());
    }

    public List<PhotoResponse> getPhotosForTeamMember(Long eventId, Long memberUserId) {
        if (!eventMemberRepository.existsByEventIdAndUserId(eventId, memberUserId)) {
            throw new ForbiddenException("You are not assigned to this event");
        }

        User uploader = userRepository.findById(memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Photo> photos = photoRepository.findByEventIdAndUploadedBy(eventId, memberUserId);
        return photos.stream()
                .map(p -> mapToPhotoResponse(p, uploader.getName()))
                .collect(Collectors.toList());
    }

    public List<PhotoResponse> getMyUploadedPhotos(Long memberUserId) {
        User uploader = userRepository.findById(memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Photo> photos = photoRepository.findByUploadedBy(memberUserId);
        return photos.stream()
                .map(p -> mapToPhotoResponse(p, uploader.getName()))
                .collect(Collectors.toList());
    }

    @Transactional
    public PhotoResponse togglePhotoSelection(Long photoId, Long adminId, Role userRole) {
        if (userRole != Role.ADMIN) {
            throw new ForbiddenException("Only admins can select or unselect photos");
        }

        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found with id: " + photoId));

        Event event = eventRepository.findById(photo.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Associated event not found"));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to select photos for this event");
        }

        photo.setSelected(!photo.isSelected());
        Photo updatedPhoto = photoRepository.save(photo);

        User uploader = userRepository.findById(updatedPhoto.getUploadedBy()).orElse(null);
        String uploaderName = uploader != null ? uploader.getName() : "Unknown User";

        return mapToPhotoResponse(updatedPhoto, uploaderName);
    }

    private PhotoResponse mapToPhotoResponse(Photo photo, String uploaderName) {
        return new PhotoResponse(
                photo.getId(),
                photo.getEventId(),
                photo.getUploadedBy(),
                uploaderName,
                photo.getFilename(),
                photo.getStorageUrl(),
                photo.getStoragePublicId(),
                photo.getFileSize(),
                photo.isSelected(),
                photo.getCreatedAt()
        );
    }
}
