package com.ntnu.backend.models.responses.devices;

import java.util.List;

public class DeviceDataTable {

    private Object deviceId;
    List<DeviceDataPoint> deviceDataPoints;

    public DeviceDataTable(Object deviceId, List<DeviceDataPoint> deviceDataPoints) {
        this.deviceId = deviceId;
        this.deviceDataPoints = deviceDataPoints;
    }

    public Object getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(long deviceId) {
        this.deviceId = deviceId;
    }

    public List<DeviceDataPoint> getDeviceDataPoints() {
        return deviceDataPoints;
    }

    public void setDeviceDataPoints(List<DeviceDataPoint> deviceDataPoints) {
        this.deviceDataPoints = deviceDataPoints;
    }
}
