package com.ntnu.backend.DAO.notification;

import com.ntnu.backend.models.entities.composites.BaseUser_Room_Composite;
import com.ntnu.backend.models.entities.notifications.NotificationSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NotificationSubscriptionRepository extends JpaRepository<NotificationSubscription, BaseUser_Room_Composite> {

    @Query(value = "DELETE FROM notification_subscription WHERE user_name=?1 AND room=?2", nativeQuery = true)
    void deleteByUsernameAndRoomId(String username, long roomId);

}
