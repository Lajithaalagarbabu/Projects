package com.trizenai.photoshare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "event_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "user_id"})
})
public class EventMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public EventMember() {
    }

    public EventMember(Long eventId, Long userId) {
        this.eventId = eventId;
        this.userId = userId;
    }

    public EventMember(Long id, Long eventId, Long userId) {
        this.id = id;
        this.eventId = eventId;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
