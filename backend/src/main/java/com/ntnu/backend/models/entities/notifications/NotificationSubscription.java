package com.ntnu.backend.models.entities.notifications;

import com.ntnu.backend.models.entities.Room;
import com.ntnu.backend.models.entities.composites.BaseUser_Room_Composite;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "notification_subscription")
public class NotificationSubscription {

    @EmbeddedId
    private BaseUser_Room_Composite baseUser_room_composite;

    @Column(name = "notification_token")
    private String notificationToken;

    @Column(name = "expires_timestamp")
    private Timestamp expiresTimestamp;

    public NotificationSubscription() {  }

    public NotificationSubscription(BaseUser_Room_Composite baseUser_room_composite, String notificationToken, Timestamp expiresTimestamp) {
        this.baseUser_room_composite = baseUser_room_composite;
        this.notificationToken = notificationToken;
        this.expiresTimestamp = expiresTimestamp;
    }

    public BaseUser_Room_Composite getBaseUser_room_composite() {
        return baseUser_room_composite;
    }

    public void setBaseUser_room_composite(BaseUser_Room_Composite baseUser_room_composite) {
        this.baseUser_room_composite = baseUser_room_composite;
    }

    public String getNotificationToken() {
        return notificationToken;
    }

    public void setNotificationToken(String notificationToken) {
        this.notificationToken = notificationToken;
    }

    public Timestamp getExpiresTimestamp() {
        return expiresTimestamp;
    }

    public void setExpiresTimestamp(Timestamp expiresTimestamp) {
        this.expiresTimestamp = expiresTimestamp;
    }
}
