import { useEffect, useRef } from 'react';
import { Subscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { isDevice } from 'expo-device';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RoomsStackParamList } from '../navigation/types';
import { roomsState } from '../state/rooms';
import { Measurement, Room } from '../state/types';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { currentMeasurementState, roomIdState } from '../state/room';
import { authState } from '../state/auth';

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
    const navigation = useNavigation<NativeStackNavigationProp<RoomsStackParamList, 'Rooms'>>();

    const responseListener = useRef<Subscription>();

    const auth = useRecoilValue(authState);

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

    const registerNotificationListener = useRecoilCallback(({ snapshot }) => async () => {
        const rooms = await snapshot.getPromise(roomsState);

        if (rooms) {
            // Listener for interaction with notifications (tap)
            responseListener.current = Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const data = response.notification.request.content
                        .data as unknown as PushNotificationData;

                    const room = rooms.find((r) => r.id == data.roomId);

                    if (room) {
                        goToRoom(room, data.measurement);
                    }
                }
            );

            return () => {
                if (responseListener.current) {
                    Notifications.removeNotificationSubscription(responseListener.current);
                }
            };
        }
    });

    const goToRoom = useRecoilCallback(({ set }) => async (room: Room, measurement: string) => {
        set(roomIdState, room.id);
        set(currentMeasurementState, measurement as Measurement);
        navigation.navigate('Room', { room: room });
    });

    useEffect(() => {
        registerForPushNotifications();
    }, []);

    useEffect(() => {
        if (auth.accessToken) {
            registerNotificationListener();
        }
    }, [auth.accessToken]);
}
