package com.ntnu.backend.models.requests.FCM;

public class SubscribeToTopicRequest {

    public String token;
    public String topicName;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }
}
