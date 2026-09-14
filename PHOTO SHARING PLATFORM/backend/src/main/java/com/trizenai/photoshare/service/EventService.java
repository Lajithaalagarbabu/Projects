package com.trizenai.photoshare.service;

import com.trizenai.photoshare.dto.EventRequest;
import com.trizenai.photoshare.dto.EventResponse;
import com.trizenai.photoshare.dto.UserResponse;
import com.trizenai.photoshare.entity.Event;
import com.trizenai.photoshare.entity.EventMember;
import com.trizenai.photoshare.entity.Gallery;
import com.trizenai.photoshare.entity.User;
import com.trizenai.photoshare.enums.Role;
import com.trizenai.photoshare.exception.BadRequestException;
import com.trizenai.photoshare.exception.ForbiddenException;
import com.trizenai.photoshare.exception.ResourceNotFoundException;
import com.trizenai.photoshare.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;
    private final GalleryRepository galleryRepository;

    public EventService(
            EventRepository eventRepository,
            EventMemberRepository eventMemberRepository,
            UserRepository userRepository,
            PhotoRepository photoRepository,
            GalleryRepository galleryRepository
    ) {
        this.eventRepository = eventRepository;
        this.eventMemberRepository = eventMemberRepository;
        this.userRepository = userRepository;
        this.photoRepository = photoRepository;
        this.galleryRepository = galleryRepository;
    }

    @Transactional
    public EventResponse createEvent(EventRequest request, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only admins can create events");
        }

        Event event = new Event();
        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setCreatedBy(adminId);

        Event savedEvent = eventRepository.save(event);

        return mapToEventResponse(savedEvent, admin.getName());
    }

    public List<EventResponse> getAdminEvents(Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        List<Event> events = eventRepository.findByCreatedBy(adminId);
        return events.stream()
                .map(e -> mapToEventResponse(e, admin.getName()))
                .collect(Collectors.toList());
    }

    public EventResponse getEventByIdForAdmin(Long eventId, Long adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to access this event");
        }

        User admin = userRepository.findById(adminId).orElse(null);
        String adminName = admin != null ? admin.getName() : "Admin";

        return mapToEventResponse(event, adminName);
    }

    @Transactional
    public void deleteEvent(Long eventId, Long adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to delete this event");
        }

        eventRepository.delete(event);
    }

    @Transactional
    public void addMemberToEvent(Long eventId, Long memberUserId, Long adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to manage members for this event");
        }

        User member = userRepository.findById(memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + memberUserId));

        if (member.getRole() != Role.TEAM_MEMBER) {
            throw new BadRequestException("User is not a Team Member");
        }

        if (eventMemberRepository.existsByEventIdAndUserId(eventId, memberUserId)) {
            throw new BadRequestException("Team member is already assigned to this event");
        }

        EventMember eventMember = new EventMember(eventId, memberUserId);
        eventMemberRepository.save(eventMember);
    }

    public List<UserResponse> getEventMembers(Long eventId, Long adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to view members for this event");
        }

        List<EventMember> members = eventMemberRepository.findByEventId(eventId);
        List<Long> userIds = members.stream().map(EventMember::getUserId).collect(Collectors.toList());

        return userRepository.findAllById(userIds).stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeMemberFromEvent(Long eventId, Long memberUserId, Long adminId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getCreatedBy().equals(adminId)) {
            throw new ForbiddenException("You are not authorized to manage members for this event");
        }

        if (!eventMemberRepository.existsByEventIdAndUserId(eventId, memberUserId)) {
            throw new ResourceNotFoundException("Team member is not assigned to this event");
        }

        eventMemberRepository.deleteByEventIdAndUserId(eventId, memberUserId);
    }

    public List<EventResponse> getTeamMemberEvents(Long memberUserId) {
        List<Event> events = eventRepository.findAssignedEventsByUserId(memberUserId);
        return events.stream().map(e -> {
            User admin = userRepository.findById(e.getCreatedBy()).orElse(null);
            String adminName = admin != null ? admin.getName() : "Admin";
            return mapToEventResponse(e, adminName);
        }).collect(Collectors.toList());
    }

    public EventResponse getEventDetailsForTeamMember(Long eventId, Long memberUserId) {
        if (!eventMemberRepository.existsByEventIdAndUserId(eventId, memberUserId)) {
            throw new ForbiddenException("You are not assigned to this event");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        User admin = userRepository.findById(event.getCreatedBy()).orElse(null);
        String adminName = admin != null ? admin.getName() : "Admin";

        return mapToEventResponse(event, adminName);
    }

    private EventResponse mapToEventResponse(Event event, String creatorName) {
        long totalPhotos = photoRepository.countByEventId(event.getId());
        long selectedPhotos = photoRepository.countByEventIdAndSelected(event.getId(), true);
        long teamMembersCount = eventMemberRepository.findByEventId(event.getId()).size();

        Optional<Gallery> galleryOpt = galleryRepository.findByEventId(event.getId());
        String galleryCode = galleryOpt.map(Gallery::getGalleryCode).orElse(null);
        Boolean galleryPublished = galleryOpt.map(Gallery::isPublished).orElse(null);

        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getEventDate(),
                event.getCreatedBy(),
                creatorName,
                event.getCreatedAt(),
                totalPhotos,
                selectedPhotos,
                teamMembersCount,
                galleryCode,
                galleryPublished
        );
    }
}
