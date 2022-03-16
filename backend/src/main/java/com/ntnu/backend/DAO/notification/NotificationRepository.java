package com.ntnu.backend.DAO.notification;

import com.ntnu.backend.models.entities.Device;
import com.ntnu.backend.models.entities.notifications.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Timestamp;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> getAllByDeviceAndTimestampLessThanAndTimestampGreaterThan(Device device, Timestamp lt, Timestamp gt);

    @Query(value = "SELECT n.* FROM notification n INNER JOIN device d ON n.device_id = d.id WHERE d.organization = ?1", nativeQuery = true)
    List<Notification> getAllInOrganizationWithTimestampLessThanAndTimestampGreaterThan(long orgId, Timestamp lt, Timestamp gt);

}
