package com.ntnu.backend.models.requests.devices;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class CreateDeviceRequest {

    @NotNull(message = "Device Name must be specified")
    @NotEmpty(message = "Device Name must be specified")
    private String deviceName;

    private Long roomId;

    private Double lat;
    private Double lng;

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public boolean hasValidOrNoCoordinates(){
        return (this.lat == null && this.lng == null)
                || (this.lat != null && this.lng != null && Math.abs(this.lat) <= 90 && Math.abs(this.lng) < 180);
    }

}
