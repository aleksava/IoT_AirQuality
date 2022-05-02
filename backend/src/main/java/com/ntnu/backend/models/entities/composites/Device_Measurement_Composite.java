package com.ntnu.backend.models.entities.composites;

import com.ntnu.backend.models.entities.Device;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class Device_Measurement_Composite implements Serializable {

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    @Column(name = "measurement")
    private String measurement;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Device_Measurement_Composite that = (Device_Measurement_Composite) o;
        return Objects.equals(device.getId(), that.device.getId()) && Objects.equals(measurement, that.measurement);
    }

    @Override
    public int hashCode() {
        return Objects.hash(device.getId(), measurement);
    }
}
