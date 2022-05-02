package com.ntnu.backend.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ntnu.backend.models.entities.user.BaseUser;
import com.ntnu.backend.models.entities.user.Organization;

import javax.persistence.*;

@Entity
@Table(name = "room")
public class Room {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "room_name")
    private String roomName;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization")
    private Organization organization;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user")
    private BaseUser createdByUser;

    public Room() {  }

    public Room(String roomName, Organization organization, BaseUser createdByUser) {
        this.roomName = roomName;
        this.organization = organization;
        this.createdByUser = createdByUser;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public long getOrganizationId() {
        return organization == null ? -1 : organization.getId();
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public BaseUser getCreatedByUser() {
        return createdByUser;
    }

    public void setCreatedByUser(BaseUser createdByUser) {
        this.createdByUser = createdByUser;
    }
}
