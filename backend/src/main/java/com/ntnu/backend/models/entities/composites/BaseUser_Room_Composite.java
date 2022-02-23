package com.ntnu.backend.models.entities.composites;

import com.ntnu.backend.models.entities.Room;
import com.ntnu.backend.models.entities.user.BaseUser;

import javax.persistence.Embeddable;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class BaseUser_Room_Composite implements Serializable {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_name")
    private BaseUser baseUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room")
    private Room room;

    public BaseUser_Room_Composite() {  }

    public BaseUser_Room_Composite(BaseUser baseUser, Room room) {
        this.baseUser = baseUser;
        this.room = room;
    }

    public BaseUser getBaseUser() {
        return baseUser;
    }

    public void setBaseUser(BaseUser baseUser) {
        this.baseUser = baseUser;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BaseUser_Room_Composite that = (BaseUser_Room_Composite) o;
        return Objects.equals(baseUser.getUsername(), that.baseUser.getUsername()) && Objects.equals(room.getId(), that.room.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(baseUser.getUsername(), room.getId());
    }
}
