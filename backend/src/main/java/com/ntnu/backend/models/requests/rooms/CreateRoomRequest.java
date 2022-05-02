package com.ntnu.backend.models.requests.rooms;

import com.ntnu.backend.models.entities.Room;
import com.ntnu.backend.models.entities.user.BaseUser;
import com.ntnu.backend.models.entities.user.Organization;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class CreateRoomRequest {

    @NotNull
    @NotEmpty
    private String roomName;

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public Room toRoom(Organization organization, BaseUser createdByUser){
        return new Room(roomName, organization, createdByUser);
    }

}
