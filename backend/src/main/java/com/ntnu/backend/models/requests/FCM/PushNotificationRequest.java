package com.ntnu.backend.models.requests.FCM;

public class PushNotificationRequest {

    private String title;
    private String message;
    private PushMessageRequest messageRequest;

    private String notificationTag;

    public PushNotificationRequest() {
    }

    public PushNotificationRequest(String title, String message, PushMessageRequest messageRequest, String queueRoom) {
        this.title = title;
        this.message = message;
        this.messageRequest = messageRequest;
        this.notificationTag = queueRoom;
    }

    public String getNotificationTag() {
        return notificationTag;
    }

    public void setNotificationTag(String notificationTag) {
        this.notificationTag = notificationTag;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public PushMessageRequest getMessageRequest() {
        return messageRequest;
    }

    public void setMessageRequest(PushMessageRequest messageRequest) {
        this.messageRequest = messageRequest;
    }
}
