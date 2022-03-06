import { useRecoilState } from 'recoil';
import { measurements } from '../../constants';
import useLoadable from '../../hooks/useLoadable';
import { currentMeasurementState, roomInfoState } from '../../state/room';
import { Measurement } from '../../state/types';
import { Tab, Tabs } from '../common/Tabs';

export default function MeasurementTabs() {
    const { data: roomInfo } = useLoadable(roomInfoState);
    const [currentMeasurement, setCurrentMeasurement] = useRecoilState(currentMeasurementState);

    return (
        <Tabs>
            {Object.entries(measurements).map(([key, measurement], i) => (
                <Tab
                    key={i}
                    index={i}
                    selected={key === currentMeasurement}
                    warning={
                        roomInfo &&
                        roomInfo.notifications.some(
                            (notification) => notification.measurement == key
                        )
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
