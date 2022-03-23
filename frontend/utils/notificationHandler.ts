import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { Subscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { isDevice } from 'expo-device';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoomsStackParamList } from '../navigation/types';
import { roomsState } from '../state/rooms';
import { Room } from '../state/types';
import useLoadable from '../hooks/useLoadable';

interface PushNotificationData {
    deviceId: number;
    roomId: number;
    measurement: string;
}

// Allow in-app notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false
    })
});

export default function notificationHandler() {
    const { data: rooms } = useLoadable<Room[]>(roomsState);

    const navigation = useNavigation<NativeStackNavigationProp<RoomsStackParamList, 'Rooms'>>();

    const responseListener = useRef<Subscription>();

    const registerForPushNotifications = async () => {
        let token;

        if (isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notifications');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            alert('Must use physical device for push notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C'
            });
        }

        return token;
    };

    useEffect(() => {
        if (rooms) {
            registerForPushNotifications();

            // Listener for interaction with notifications (tap)
            responseListener.current = Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const data = response.notification.request.content
                        .data as unknown as PushNotificationData;

                    if (rooms) {
                        const room = rooms.find((room) => room.id == data.roomId);

                        if (room) {
                            navigation.navigate('Room', {
                                room: room,
                                measurement: data.measurement
                            });
                        }
                    }
                }
            );

            return () => {
                if (responseListener.current) {
                    Notifications.removeNotificationSubscription(responseListener.current);
                }
            };
        }
    }, [rooms]);
}
