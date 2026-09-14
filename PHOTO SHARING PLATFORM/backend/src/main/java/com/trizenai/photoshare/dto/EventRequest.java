package com.trizenai.photoshare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class EventRequest {

    @NotBlank(message = "Event name is required")
    @Size(min = 2, max = 150, message = "Event name must be between 2 and 150 characters")
    private String name;

    private String description;

    private LocalDate eventDate;

    public EventRequest() {
    }

    public EventRequest(String name, String description, LocalDate eventDate) {
        this.name = name;
        this.description = description;
        this.eventDate = eventDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }
}
