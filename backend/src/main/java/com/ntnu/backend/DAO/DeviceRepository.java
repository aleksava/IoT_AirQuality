package com.ntnu.backend.DAO;

import com.ntnu.backend.models.entities.Device;
import com.ntnu.backend.models.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    List<Device> findAllByRoom(Room room);

}
