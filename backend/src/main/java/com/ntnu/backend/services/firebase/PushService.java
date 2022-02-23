package com.ntnu.backend.services.firebase;
/*
import com.ntnu.backend.models.requests.FCM.PushMessageRequest;
import com.ntnu.backend.models.requests.FCM.PushNotificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.concurrent.ExecutionException;

@Component
public class PushService {

    private final Logger logger = LoggerFactory.getLogger(PushService.class);

    private final FCMService fcmService;

    @Autowired
    public PushService(FCMService fcmService) {
        this.fcmService = fcmService;
    }

    public void sendStandardPushNotification(PushNotificationRequest request) {
        try {
            fcmService.sendNotificationMessage(request);
        } catch (InterruptedException | ExecutionException e) {
            logger.error(e.getMessage());
        }
    }

    public void sendStandardPushMessage(PushMessageRequest request){
        try {
            fcmService.sendMessage(request);
        } catch (InterruptedException | ExecutionException e) {
            logger.error(e.getMessage());
        }
    }
}
*/