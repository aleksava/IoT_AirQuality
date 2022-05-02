package com.ntnu.backend.models.entities.notifications;

import com.ntnu.backend.models.entities.composites.Device_Measurement_Composite;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "device_measurement_notification_timeout")
public class DeviceMeasurementNotificationTimeout {

    @EmbeddedId
    private Device_Measurement_Composite device_measurement_composite;

    @Column(name = "timed_out_until")
    private Timestamp timedOutUntil;

    public Device_Measurement_Composite getDevice_measurement_composite() {
        return device_measurement_composite;
    }

    public void setDevice_measurement_composite(Device_Measurement_Composite device_measurement_composite) {
        this.device_measurement_composite = device_measurement_composite;
    }

    public Timestamp getTimedOutUntil() {
        return timedOutUntil;
    }

    public void setTimedOutUntil(Timestamp timedOutUntil) {
        this.timedOutUntil = timedOutUntil;
    }
}
