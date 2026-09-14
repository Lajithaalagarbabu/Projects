package com.trizenai.photoshare.controller;

import com.trizenai.photoshare.dto.EventMemberRequest;
import com.trizenai.photoshare.dto.EventRequest;
import com.trizenai.photoshare.dto.EventResponse;
import com.trizenai.photoshare.dto.UserResponse;
import com.trizenai.photoshare.security.SecurityUtils;
import com.trizenai.photoshare.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EventController {

    private final EventService eventService;
    private final SecurityUtils securityUtils;

    public EventController(EventService eventService, SecurityUtils securityUtils) {
        this.eventService = eventService;
        this.securityUtils = securityUtils;
    }

    // --- ADMIN APIs ---

    @PostMapping("/api/admin/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request) {
        Long adminId = securityUtils.getCurrentUserId();
        EventResponse response = eventService.createEvent(request, adminId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/api/admin/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getAdminEvents() {
        Long adminId = securityUtils.getCurrentUserId();
        List<EventResponse> events = eventService.getAdminEvents(adminId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/api/admin/events/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> getAdminEventDetails(@PathVariable Long eventId) {
        Long adminId = securityUtils.getCurrentUserId();
        EventResponse event = eventService.getEventByIdForAdmin(eventId, adminId);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/api/admin/events/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        Long adminId = securityUtils.getCurrentUserId();
        eventService.deleteEvent(eventId, adminId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/admin/events/{eventId}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> addMemberToEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventMemberRequest request
    ) {
        Long adminId = securityUtils.getCurrentUserId();
        eventService.addMemberToEvent(eventId, request.getUserId(), adminId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/api/admin/events/{eventId}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getEventMembers(@PathVariable Long eventId) {
        Long adminId = securityUtils.getCurrentUserId();
        List<UserResponse> members = eventService.getEventMembers(eventId, adminId);
        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/api/admin/events/{eventId}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeMemberFromEvent(
            @PathVariable Long eventId,
            @PathVariable Long userId
    ) {
        Long adminId = securityUtils.getCurrentUserId();
        eventService.removeMemberFromEvent(eventId, userId, adminId);
        return ResponseEntity.noContent().build();
    }

    // --- TEAM MEMBER APIs ---

    @GetMapping("/api/team/events")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER', 'ADMIN')")
    public ResponseEntity<List<EventResponse>> getTeamMemberEvents() {
        Long userId = securityUtils.getCurrentUserId();
        List<EventResponse> events = eventService.getTeamMemberEvents(userId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/api/team/events/{eventId}")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER', 'ADMIN')")
    public ResponseEntity<EventResponse> getTeamMemberEventDetails(@PathVariable Long eventId) {
        Long userId = securityUtils.getCurrentUserId();
        EventResponse event = eventService.getEventDetailsForTeamMember(eventId, userId);
        return ResponseEntity.ok(event);
    }
}
