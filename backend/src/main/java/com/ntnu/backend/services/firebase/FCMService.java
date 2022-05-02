package com.ntnu.backend.services.firebase;
/*
import com.google.firebase.messaging.*;
import com.ntnu.backend.models.requests.FCM.PushMessageRequest;
import com.ntnu.backend.models.requests.FCM.PushNotificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ExecutionException;

@Service
public class FCMService {

    private final Logger logger = LoggerFactory.getLogger(FCMService.class);

    public void sendNotificationMessage(PushNotificationRequest request)
            throws InterruptedException, ExecutionException {
        if (request.getMessageRequest().getTokensToSendTo().size() > 0) {
            MulticastMessage message = getPreconfiguredNotificationMessageWithData(request);
            BatchResponse response = sendAndGetResponse(message);
            logger.info("Sent multicast message notification with data: " + response.getSuccessCount() + " successes, " + response.getFailureCount() + " fails.");
        }
    }

    public void sendMessage(PushMessageRequest request)
            throws InterruptedException, ExecutionException {
        if(request.getTokensToSendTo().size() > 0) {
            MulticastMessage message = getPreconfiguredMulticastMessageWithData(request);
            BatchResponse response = sendAndGetResponse(message);
            logger.info("Sent multicast message: " + response.getSuccessCount() + " successes, " + response.getFailureCount() + " fails.");
        }
    }

    public void sendNotificationMessageWithoutData(PushNotificationRequest request)
            throws InterruptedException, ExecutionException {
        if (request.getMessageRequest().getTokensToSendTo().size() > 0) {
            MulticastMessage message = getPreconfiguredNotificationMessageWithoutData(request);
            BatchResponse response = sendAndGetResponse(message);
            logger.info("Sent multicast message notification without data: " + response.getSuccessCount() + " successes, " + response.getFailureCount() + " fails.");
        }
    }


    private BatchResponse sendAndGetResponse(MulticastMessage message) throws InterruptedException, ExecutionException {
        return FirebaseMessaging.getInstance().sendMulticastAsync(message).get();
    }

    private AndroidConfig getAndroidConfig(String tag) {
        return AndroidConfig.builder()
                .setTtl(Duration.ofMinutes(2).toMillis()).setCollapseKey(tag)
                .setPriority(AndroidConfig.Priority.HIGH)
                .setNotification(
                        AndroidNotification.builder()
                                .setDefaultVibrateTimings(true)
                                .setTag(tag).build()
                ).build();
    }


    private ApnsConfig getApnsConfig(String tag) {
        return ApnsConfig.builder()
                .setAps(Aps.builder().setCategory(tag).setThreadId(tag).build())
                .build();
    }

    private MulticastMessage getPreconfiguredNotificationMessageToToken(PushNotificationRequest request) {
        return getPreconfiguredNotificationMessageBuilder(request)
                .addAllTokens(request.getMessageRequest().getTokensToSendTo())
                .build();
    }

    private MulticastMessage getPreconfiguredNotificationMessageWithoutData(PushNotificationRequest request) {
        return getPreconfiguredNotificationMessageBuilder(request)
                .addAllTokens(request.getMessageRequest().getTokensToSendTo())
                .build();
    }

    private MulticastMessage getPreconfiguredMulticastMessageWithData(PushMessageRequest request) {
        return MulticastMessage.builder()
                .putAllData(request.getData())
                .addAllTokens(request.getTokensToSendTo())
                .build();
    }

    private MulticastMessage getPreconfiguredNotificationMessageWithData(PushNotificationRequest request) {
        return getPreconfiguredNotificationMessageBuilder(request)
                .putAllData(request.getMessageRequest().getData())
                .addAllTokens(request.getMessageRequest().getTokensToSendTo())
                .build();
    }

    private MulticastMessage.Builder getPreconfiguredNotificationMessageBuilder(PushNotificationRequest request) {
        AndroidConfig androidConfig = getAndroidConfig(request.getNotificationTag());
        ApnsConfig apnsConfig = getApnsConfig(request.getNotificationTag());


        return MulticastMessage.builder()
                .setApnsConfig(apnsConfig)
                .setAndroidConfig(androidConfig)
                .setNotification(
                    Notification.builder()
                            .setTitle(request.getTitle())
                            .setBody(request.getMessage()).build()
                );
    }

}
*/