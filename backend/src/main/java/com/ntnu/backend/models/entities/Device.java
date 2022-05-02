package com.ntnu.backend.models.entities;

import com.ntnu.backend.models.entities.user.Organization;

import javax.persistence.*;

@Entity
@Table(name = "device")
public class Device {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "device_name")
    private String deviceName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization")
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room")
    private Room room;

    @Column(name = "lat")
    private double lat;

    @Column(name = "lng")
    private double lng;

    public Device() {  }

    public Device(String deviceName, Organization organization, Room room, double lat, double lng) {
        this.deviceName = deviceName;
        this.organization = organization;
        this.room = room;
        this.lat = lat;
        this.lng = lng;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public long getOrganizationId() {
        return organization == null ? -1 : organization.getId();
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public long getRoomId() {
        return room == null ? -1 : room.getId();
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }
}
