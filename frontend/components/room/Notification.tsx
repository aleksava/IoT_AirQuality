import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTheme } from 'styled-components/native';
import { measurements } from '../../constants';
import useLoadable from '../../hooks/useLoadable';
import {
    currentMeasurementState,
    currentNotificationsState,
    currentRoomDevicesState
} from '../../state/room';
import { Notification as INotification, NotificationType } from '../../state/types';
import IconCard from '../common/IconCard';
import { ExclamationIcon } from '../icons';

export default function Notification() {
    const theme = useTheme();

    const currentMeasurement = useRecoilValue(currentMeasurementState);

    const { data: currentRoomDevices } = useLoadable(currentRoomDevicesState);
    const { data: notifications, loading: notificationsLoading } =
        useLoadable(currentNotificationsState);

    const [persistentNotifications, setPersistentNotifications] = useState<
        INotification[] | undefined
    >();

    useEffect(() => {
        if (!notificationsLoading && notifications != undefined) {
            setPersistentNotifications(notifications);
        }
    }, [notifications, notificationsLoading]);

    if (currentRoomDevices && persistentNotifications) {
        const measurementInfo = measurements[currentMeasurement];

        return (
            <>
                {persistentNotifications.map((notification, index) => (
                    <IconCard
                        key={index}
                        icon={ExclamationIcon}
                        backgroundColor={theme.colors.background.red}
                        iconColor={theme.colors.notification}
                        text={`${
                            currentRoomDevices?.find(
                                (device) => device.id == parseInt(notification.deviceId)
                            )?.deviceName
                        }: ${measurementInfo.name} is ${
                            notification.type === NotificationType.OverMaxThreshold
                                ? 'above'
                                : 'below'
                        } the recommended threshold of ${
                            notification.type === NotificationType.OverMaxThreshold
                                ? measurementInfo.maxThreshold
                                : measurementInfo.minThreshold
                        }${measurementInfo.unit}.`}
                    />
                ))}
            </>
        );
    }

    return null;
}
