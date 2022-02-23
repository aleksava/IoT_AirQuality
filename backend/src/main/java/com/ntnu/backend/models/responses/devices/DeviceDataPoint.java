package com.ntnu.backend.models.responses.devices;

public class DeviceDataPoint {

    private long timestamp;
    private String field;
    private Object value;

    public DeviceDataPoint(long timestamp, String field, Object value) {
        this.timestamp = timestamp;
        this.field = field;
        this.value = value;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
