import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { measurements } from '../../constants';
import useLoadable from '../../hooks/useLoadable';
import { currentMeasurementState, notificationsState } from '../../state/room';
import { Measurement, Notification } from '../../state/types';
import { Tab, Tabs } from '../common/Tabs';

export default function MeasurementTabs() {
    const { data: notifications } = useLoadable(notificationsState);
    const [currentMeasurement, setCurrentMeasurement] = useRecoilState(currentMeasurementState);

    const [persistentNotifications, setPersistentNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (notifications) {
            setPersistentNotifications(notifications);
        }
    }, [notifications]);

    return (
        <Tabs>
            {Object.entries(measurements).map(([key, measurement], i) => (
                <Tab
                    key={i}
                    index={i}
                    selected={key === currentMeasurement}
                    warning={
                        persistentNotifications &&
                        persistentNotifications.some((n) => n.measurement == key)
                    }
                    onPress={() => {
                        setCurrentMeasurement(key as Measurement);
                    }}
                >
                    {measurement.name}
                </Tab>
            ))}
        </Tabs>
    );
}
