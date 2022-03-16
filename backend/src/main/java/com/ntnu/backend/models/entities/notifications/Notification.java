package com.ntnu.backend.models.entities.notifications;

import com.ntnu.backend.models.entities.Device;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "notification")
public class Notification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    @Column(name = "measurement")
    private String measurement;

    @Column(name = "timestamp")
    private Timestamp timestamp;

    @Column(name = "message")
    private String message;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getDeviceId() {
        return device == null ? -1 : device.getId();
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public String getMeasurement() {
        return measurement;
    }

    public void setMeasurement(String measurement) {
        this.measurement = measurement;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
