package com.ntnu.backend.controllers;

import com.ntnu.backend.DAO.DeviceRepository;
import com.ntnu.backend.DAO.RoomRepository;
import com.ntnu.backend.DAO.notification.NotificationRepository;
import com.ntnu.backend.DAO.notification.NotificationSubscriptionRepository;
import com.ntnu.backend.models.entities.Device;
import com.ntnu.backend.models.entities.Room;
import com.ntnu.backend.models.entities.composites.BaseUser_Room_Composite;
import com.ntnu.backend.models.entities.notifications.Notification;
import com.ntnu.backend.models.entities.notifications.NotificationSubscription;
import com.ntnu.backend.models.entities.user.BaseUser;
import com.ntnu.backend.models.requests.SubscribeToNotificationsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final NotificationSubscriptionRepository notificationSubscriptionRepository;
    private final DeviceRepository deviceRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public NotificationController(NotificationRepository notificationRepository, DeviceRepository deviceRepository, NotificationSubscriptionRepository notificationSubscriptionRepository, RoomRepository roomRepository) {
        this.notificationRepository = notificationRepository;
        this.deviceRepository = deviceRepository;
        this.notificationSubscriptionRepository = notificationSubscriptionRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping("/get_for_device/{deviceId}")
    public  ResponseEntity<List<Notification>> getDeviceNotifications(@AuthenticationPrincipal Jwt jwt,
                                                     @PathVariable long deviceId,
                                                     @RequestParam(name = "lookback_start", defaultValue = "1") int lookbackStart,
                                                     @RequestParam(name = "lookback_end", defaultValue = "0") int lookbackEnd){

        if(lookbackEnd >= lookbackStart) return ResponseEntity.badRequest().build();

        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if(deviceOptional.isEmpty() || deviceOptional.get().getOrganizationId() != (long) jwt.getClaim("http://AQ/orgId")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Timestamp lt = new Timestamp(Instant.now().toEpochMilli() - 86400000L*lookbackEnd);
        Timestamp gt = new Timestamp(Instant.now().toEpochMilli() - 86400000L*lookbackStart);
        return ResponseEntity.ok(notificationRepository.getAllByDeviceAndTimestampLessThanAndTimestampGreaterThan(deviceOptional.get(), lt, gt));
    }

    @GetMapping("/get_all_in_organization")
    public  ResponseEntity<List<Notification>> getOrganizationNotifications(@AuthenticationPrincipal Jwt jwt,
                                                                            @RequestParam(name = "lookback_start", defaultValue = "1") int lookbackStart,
                                                                            @RequestParam(name = "lookback_end", defaultValue = "0") int lookbackEnd){
        if(lookbackEnd >= lookbackStart) return ResponseEntity.badRequest().build();

        Timestamp lt = new Timestamp(Instant.now().toEpochMilli() - 86400000L*lookbackEnd);
        Timestamp gt = new Timestamp(Instant.now().toEpochMilli() - 86400000L*lookbackStart);
        return ResponseEntity.ok(notificationRepository.getAllInOrganizationWithTimestampLessThanAndTimestampGreaterThan((long) jwt.getClaim("http://AQ/orgId"), lt, gt));
    }

    @PostMapping("/subscribe_for_room")
    public ResponseEntity<?> subscribeToRoomNotifications(@AuthenticationPrincipal Jwt jwt,
                                                          @Valid @RequestBody SubscribeToNotificationsRequest subscribeToNotificationsRequest){

        Optional<Room> roomOptional = roomRepository.findById(subscribeToNotificationsRequest.getRoomId());
        if(roomOptional.isEmpty() || roomOptional.get().getOrganizationId() != (long) jwt.getClaim("http://AQ/orgId")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        BaseUser_Room_Composite id = new BaseUser_Room_Composite(BaseUser.fromUsername(jwt.getClaim("http://AQ/username")), roomOptional.get());
        Optional<NotificationSubscription> existingSubscriptionOptional = notificationSubscriptionRepository.findById(id);
        if(existingSubscriptionOptional.isPresent()){
            NotificationSubscription updatedSubscription = existingSubscriptionOptional.get();
            updatedSubscription.setNotificationToken(subscribeToNotificationsRequest.getToken());
            updatedSubscription.setExpiresTimestamp(new Timestamp(Instant.now().toEpochMilli() + 60000L*subscribeToNotificationsRequest.getLastForMinutes()));
        }

        return ResponseEntity.ok(notificationSubscriptionRepository.save(subscribeToNotificationsRequest.toNotificationSubscription(id)));
    }

    @DeleteMapping("/unsubscribe_for_room/{roomId}")
    public ResponseEntity<?> subscribeToRoomNotifications(@AuthenticationPrincipal Jwt jwt,
                                                          @PathVariable long roomId){

        notificationSubscriptionRepository.deleteByUsernameAndRoomId(jwt.getClaim("http://AQ/username"), roomId);
        return ResponseEntity.ok().build();
    }


}
