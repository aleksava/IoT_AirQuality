import { useRecoilValue } from 'recoil';
import styled, { useTheme } from 'styled-components/native';
import { measurements } from '../../constants';
import useLoadable from '../../hooks/useLoadable';
import { currentMeasurementState, roomInfoState } from '../../state/room';
import { NotificationType } from '../../state/types';
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

    const { data: roomInfo } = useLoadable(roomInfoState);
    const currentMeasurement = useRecoilValue(currentMeasurementState);

    const notification = roomInfo?.notifications.find((n) => n.measurement === currentMeasurement);

    if (notification) {
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
                            notification.type === NotificationType.OverMaxThreshold
                                ? 'above'
                                : 'below'
                        } the recommended threshold of ${
                            notification.type === NotificationType.OverMaxThreshold
                                ? measurementInfo.maxThreshold
                                : measurementInfo.maxThreshold
                        }${measurementInfo.unit}.`}
                    </NotificationText>
                </NotificationCardContent>
            </Card>
        );
    }

    return null;
}
