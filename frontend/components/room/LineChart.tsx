import { useRecoilValue } from 'recoil';
import { useTheme } from 'styled-components/native';
import {
    currentMeasurementState,
    dataPointsCurrentMeasurementState,
    lookbackState,
    yAxisMaxValueState,
    yAxisMinValueState,
    currentRoomVisibleDevicesState
} from '../../state/room';
import { Dimensions } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import { processFontFamily } from 'expo-font';
import { measurements } from '../../constants';
import { useMemo } from 'react';

const screenWidth = Dimensions.get('window').width;
const now = new Date();

export default function LineChart() {
    const theme = useTheme();

    const currentMeasurement = useRecoilValue(currentMeasurementState);
    const measurementInfo = measurements[currentMeasurement];

    const dataPoints = useRecoilValue(dataPointsCurrentMeasurementState);

    const visibleDevices = useRecoilValue(currentRoomVisibleDevicesState);

    const yAxisMaxValue = useRecoilValue(yAxisMaxValueState);
    const yAxisMinValue = useRecoilValue(yAxisMinValueState);

    const lookback = useRecoilValue(lookbackState);

    const lookbackDate = useMemo(() => {
        const date = new Date();
        date.setHours(date.getHours() - lookback);
        return date;
    }, [lookback]);

    return (
        <VictoryChart
            domainPadding={{ y: 16 }}
            domain={{ y: [yAxisMinValue, yAxisMaxValue] }}
            width={screenWidth - 32}
            scale={{ x: 'time' }}
            padding={{ top: 16, right: 16, bottom: 24, left: 50 }}
            height={240}
        >
            <VictoryAxis
                dependentAxis
                crossAxis={false}
                tickFormat={(tick) => tick + measurementInfo.unit}
                style={{
                    axis: { stroke: 'transparent' },
                    tickLabels: {
                        fill: theme.colors.neutrals.gray3,
                        fontFamily: processFontFamily('notosans-regular')!,
                        fontSize: '10px'
                    },
                    grid: {
                        stroke: theme.colors.neutrals.gray1,
                        strokeWidth: 1,
                        strokeDasharray: 8
                    }
                }}
            />
            <VictoryAxis
                fixLabelOverlap
                style={{
                    axis: { stroke: 'transparent' },
                    tickLabels: {
                        fill: theme.colors.neutrals.gray3,
                        fontFamily: processFontFamily('notosans-regular')!,
                        fontSize: '10px'
                    }
                }}
            />

            {Object.entries(dataPoints).reduce((lines, [deviceId, deviceDataPoints], index) => {
                if (visibleDevices.includes(parseInt(deviceId))) {
                    lines.push(
                        <VictoryLine
                            key={index}
                            style={{
                                data: {
                                    stroke: theme.colors.chart[index],
                                    strokeWidth: 2
                                }
                            }}
                            data={deviceDataPoints}
                            x="timestamp"
                            y="value"
                            interpolation="monotoneX"
                            domain={{ x: [lookbackDate, now] }}
                        />
                    );
                }
                return lines;
            }, [] as JSX.Element[])}

            {measurementInfo.minThreshold && (
                <VictoryLine
                    y={() => measurementInfo.minThreshold}
                    domain={{ x: [lookbackDate, now] }}
                    style={{
                        data: {
                            stroke: theme.colors.error.main,
                            strokeWidth: 1.5,
                            strokeDasharray: 8,
                            strokeOpacity: 0.5
                        }
                    }}
                />
            )}
            {measurementInfo.maxThreshold && (
                <VictoryLine
                    y={() => measurementInfo.maxThreshold}
                    domain={{ x: [lookbackDate, now] }}
                    style={{
                        data: {
                            stroke: theme.colors.error.main,
                            strokeWidth: 1.5,
                            strokeDasharray: 8,
                            strokeOpacity: 0.5
                        }
                    }}
                />
            )}
        </VictoryChart>
    );
}
