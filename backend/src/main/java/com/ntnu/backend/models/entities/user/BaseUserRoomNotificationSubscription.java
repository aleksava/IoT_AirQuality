package com.ntnu.backend.models.entities.user;

import com.ntnu.backend.models.entities.composites.BaseUser_Room_Composite;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "base_user_room_notification_subscription")
public class BaseUserRoomNotificationSubscription {

    public enum SubscriptionType {
        email(0), app_notification(1);
        private final int id;
        SubscriptionType(int id) {
            this.id = (id < 0 || id > 1) ? 0 : id;
        }
    }

    @EmbeddedId
    private BaseUser_Room_Composite baseUser_room_composite;

    @Column(name = "subscribed_until")
    private long subscribedUntil; //will be a unix timestamp (ms since epoch)

    @Column(name = "timeout_minutes")
    private int timeoutMinutes; // how long to wait between notifications when rule is triggered

    @Column(name = "timed_out_until")
    private long timedOutUntil = 0; //unix timestamp, if larger than now(), a new notification won't be sent

    @Column(name = "subscription_type")
    private SubscriptionType subscriptionType;

    @Column(name = "reach_string")
    private String reachString; //email when subscriptionType is email, push token when app_notification

    public BaseUserRoomNotificationSubscription() {  }

    public BaseUserRoomNotificationSubscription(BaseUser_Room_Composite baseUser_room_composite,
                                                long subscribedUntil, int timeoutMinutes,
                                                SubscriptionType subscriptionType, String reachString) {
        this.baseUser_room_composite = baseUser_room_composite;
        this.subscribedUntil = subscribedUntil;
        this.timeoutMinutes = timeoutMinutes;
        this.subscriptionType = subscriptionType;
        this.reachString = reachString;
    }

    public BaseUser_Room_Composite getBaseUser_room_composite() {
        return baseUser_room_composite;
    }

    public void setBaseUser_room_composite(BaseUser_Room_Composite baseUser_room_composite) {
        this.baseUser_room_composite = baseUser_room_composite;
    }

    public long getSubscribedUntil() {
        return subscribedUntil;
    }

    public void setSubscribedUntil(long subscribedUntil) {
        this.subscribedUntil = subscribedUntil;
    }

    public int getTimeoutMinutes() {
        return timeoutMinutes;
    }

    public void setTimeoutMinutes(int timeoutMinutes) {
        this.timeoutMinutes = timeoutMinutes;
    }

    public long getTimedOutUntil() {
        return timedOutUntil;
    }

    public void setTimedOutUntil(long timedOutUntil) {
        this.timedOutUntil = timedOutUntil;
    }

    public SubscriptionType getSubscriptionType() {
        return subscriptionType;
    }

    public void setSubscriptionType(SubscriptionType subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public String getReachString() {
        return reachString;
    }

    public void setReachString(String reachString) {
        this.reachString = reachString;
    }
}
