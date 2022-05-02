import { getExpoPushTokenAsync } from 'expo-notifications';
import apiClient from './api';

interface SubscriptionResponse {
    baseUser_room_composite: any;
    notificationToken: string;
    expiresTimestamp: number;
}

export const NotificationsService = {
    subscribeForRoom: async (roomId: number, lastForMinutes: number) => {
        const pushNotificationToken = (await getExpoPushTokenAsync()).data;

        apiClient
            .post<SubscriptionResponse>('/notifications/subscribe_for_room', {
                roomId: roomId,
                token: pushNotificationToken,
                lastForMinutes: lastForMinutes
            })
            .then((response) => response.data);
    }
};
