import { useRecoilValue } from 'recoil';
import { useTheme } from 'styled-components/native';
import {
    currentMeasurementState,
    dataPointsCurrentMeasurementState,
    lookbackState,
    yAxisMaxValueState,
    yAxisMinValueState
} from '../../state/room';
import { Dimensions } from 'react-native';
import { VictoryArea, VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import { processFontFamily } from 'expo-font';
import { measurements } from '../../constants';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { useMemo } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function LineChart() {
    const theme = useTheme();

    const currentMeasurement = useRecoilValue(currentMeasurementState);
    const measurementInfo = measurements[currentMeasurement];
    const dataPoints = useRecoilValue(dataPointsCurrentMeasurementState);

    const yAxisMaxValue = useRecoilValue(yAxisMaxValueState);
    const yAxisMinValue = useRecoilValue(yAxisMinValueState);

    const lookback = useRecoilValue(lookbackState);

    const now = new Date();
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
                tickFormat={(tick) => tick + measurementInfo.unit}
                style={{
                    axis: { stroke: 'transparent' },
                    tickLabels: {
                        fill: theme.colors.chart.label,
                        fontFamily: processFontFamily('notosans-regular')!,
                        fontSize: '10px'
                    },
                    grid: {
                        stroke: theme.colors.chart.gridLine,
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
                        fill: theme.colors.chart.label,
                        fontFamily: processFontFamily('notosans-regular')!,
                        fontSize: '10px'
                    }
                }}
            />

            <Defs>
                <LinearGradient id="gradientStroke" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity={0.25} />
                    <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0} />
                </LinearGradient>
            </Defs>

            <VictoryArea
                style={{
                    data: {
                        fill: 'url(#gradientStroke)',
                        stroke: theme.colors.primary,
                        strokeWidth: 2
                    },
                    labels: {
                        fill: theme.colors.text.main,
                        fontFamily: processFontFamily('notosans-medium')!,
                        fontSize: '12px'
                    }
                }}
                data={dataPoints}
                labels={({ data, datum, index }) =>
                    index == data.length - 1
                        ? (datum.value as number).toFixed(measurementInfo.decimals) +
                          measurementInfo.unit
                        : null
                }
                x="timestamp"
                y="value"
                interpolation="monotoneX"
                domain={{ x: [lookbackDate, now] }}
            />

            {measurementInfo.minThreshold && (
                <VictoryLine
                    y={() => measurementInfo.minThreshold}
                    domain={{ x: [lookbackDate, now] }}
                    style={{
                        data: {
                            stroke: theme.colors.notification,
                            strokeWidth: 1,
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
                            stroke: theme.colors.notification,
                            strokeWidth: 1,
                            strokeDasharray: 8,
                            strokeOpacity: 0.5
                        }
                    }}
                />
            )}
        </VictoryChart>
    );
}
