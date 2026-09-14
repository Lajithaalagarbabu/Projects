package com.trizenai.photoshare.dto;

import jakarta.validation.constraints.NotNull;

public class EventMemberRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    public EventMemberRequest() {
    }

    public EventMemberRequest(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
