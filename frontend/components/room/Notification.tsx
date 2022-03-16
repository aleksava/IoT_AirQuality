import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { measurements } from '../../constants';
import useLoadable from '../../hooks/useLoadable';
import { currentMeasurementState, currentNotificationState } from '../../state/room';
import { Notification as INotification, NotificationType } from '../../state/types';
import Card from '../common/Card';
import { Body2 } from '../common/Text';
import { ExclamationIcon } from '../icons';

const NotificationCardContent = styled.View({
    flexDirection: 'row'
});

const NotificationText = styled(Body2)`
    ${{
        alignSelf: 'center'
    }}
`;

export default function Notification() {
    const theme = useTheme();

    const currentMeasurement = useRecoilValue(currentMeasurementState);

    const { data: notification, loading } = useLoadable(currentNotificationState);

    const [persistentNotification, setPersistentNotification] = useState<
        INotification | undefined
    >();

    useEffect(() => {
        if (!loading && notification != persistentNotification) {
            setPersistentNotification(notification);
        }
    }, [notification, loading]);

    if (persistentNotification) {
        const measurementInfo = measurements[currentMeasurement];

        return (
            <Card
                backgroundColor={theme.colors.background.red}
                padding={16}
                style={{ marginBottom: 24 }}
            >
                <NotificationCardContent>
                    <ExclamationIcon
                        width={18}
                        height={18}
                        fill={theme.colors.notification}
                        style={{ marginRight: 8, marginTop: 3 }}
                    />
                    <NotificationText flexShrink>
                        {`${measurementInfo.name} is ${
                            persistentNotification.type === NotificationType.OverMaxThreshold
                                ? 'above'
                                : 'below'
                        } the recommended threshold of ${
                            persistentNotification.type === NotificationType.OverMaxThreshold
                                ? measurementInfo.maxThreshold
                                : measurementInfo.minThreshold
                        }${measurementInfo.unit}.`}
                    </NotificationText>
                </NotificationCardContent>
            </Card>
        );
    }

    return null;
}
