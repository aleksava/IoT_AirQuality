package com.ntnu.backend.models.requests;

import com.ntnu.backend.models.entities.Room;
import com.ntnu.backend.models.entities.composites.BaseUser_Room_Composite;
import com.ntnu.backend.models.entities.notifications.NotificationSubscription;
import com.ntnu.backend.models.entities.user.BaseUser;

import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.Instant;

public class SubscribeToNotificationsRequest {

    @NotNull(message = "roomId must be defined")
    private Long roomId;

    @NotNull(message = "token must be defined")
    private String token;

    @NotNull(message = "lastForMinutes must be defined")
    private Integer lastForMinutes;

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getLastForMinutes() {
        return lastForMinutes;
    }

    public void setLastForMinutes(Integer lastForMinutes) {
        this.lastForMinutes = lastForMinutes;
    }

    public NotificationSubscription toNotificationSubscription(BaseUser_Room_Composite baseUser_room_composite){
        return new NotificationSubscription(baseUser_room_composite,
                token, new Timestamp(Instant.now().toEpochMilli() + 60000L*lastForMinutes));
    }
}
