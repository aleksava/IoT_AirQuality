import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { measurements } from '../../constants';
import useLoadable from '../../hooks/useLoadable';
import { currentMeasurementState, currentValueState } from '../../state/room';
import { DataPoint } from '../../state/types';
import { timeSince } from '../../utils/time';
import { Heading1, Subheading2 } from '../common/Text';

export default function CurrentValue() {
    const { data: currentValue, loading } = useLoadable(currentValueState);
    const currentMeasurement = useRecoilValue(currentMeasurementState);
    const measurementInfo = measurements[currentMeasurement];

    const [persistentCurrentValue, setPersistentCurrentValue] = useState<DataPoint | undefined>();

    useEffect(() => {
        if (!loading && currentValue != persistentCurrentValue) {
            setPersistentCurrentValue(currentValue);
        }
    }, [currentValue, loading]);

    return (
        <View style={{ flexGrow: 1 }}>
            {persistentCurrentValue && (
                <>
                    <Heading1>
                        {persistentCurrentValue?.value.toFixed(measurementInfo.decimals)}
                        {measurementInfo.unit}
                    </Heading1>
                    <Subheading2>{timeSince(persistentCurrentValue.timestamp)} ago</Subheading2>
                </>
            )}
        </View>
    );
}
