package com.ntnu.backend.DAO.user;

import com.ntnu.backend.models.entities.composites.BaseUser_Room_Composite;
import com.ntnu.backend.models.entities.user.BaseUserRoomNotificationSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BaseUserRoomNotificationSubscriptionRepository
        extends JpaRepository<BaseUserRoomNotificationSubscription, BaseUser_Room_Composite> {
}
