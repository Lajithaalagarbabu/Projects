package com.trizenai.photoshare.dto;

public class PinVerificationResponse {

    private boolean verified;
    private String token;
    private String eventName;
    private long photoCount;
    private String message;

    public PinVerificationResponse() {
    }

    public PinVerificationResponse(boolean verified, String token, String eventName, long photoCount, String message) {
        this.verified = verified;
        this.token = token;
        this.eventName = eventName;
        this.photoCount = photoCount;
        this.message = message;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public long getPhotoCount() {
        return photoCount;
    }

    public void setPhotoCount(long photoCount) {
        this.photoCount = photoCount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
