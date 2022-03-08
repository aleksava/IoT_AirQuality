import axios from 'axios';
import { atom, selector } from 'recoil';
import { RoomData, Measurement, NotificationType, Lookback, DataPoint, DeviceData } from './types';
import { measurements } from '../constants';

export const roomIdState = atom<number | undefined>({
    key: 'roomId',
    default: undefined
});

export const currentMeasurementState = atom<Measurement>({
    key: 'currentMeasurement',
    default: Measurement.Temperature
});

export const roomInfoState = selector<RoomData>({
    key: 'roomInfo',
    get: async ({ get }) => {
        const roomId = get(roomIdState);

        return {
            id: 1,
            name: 'R92',
            building: 'Realfagbygget',
            notificationsOn: true,
            notifications: [
                {
                    measurement: Measurement.Temperature,
                    type: NotificationType.OverMaxThreshold
                }
            ]
        };
    }
});

export const lookbackState = atom<Lookback>({
    key: 'lookback',
    default: 6
});

export const dataPointsState = selector<DataPoint[]>({
    key: 'dataPoints',
    get: async ({ get }) => {
        const roomId = get(roomIdState);
        const lookback = get(lookbackState);

        const deviceData = await axios
            .get<DeviceData[]>(
                `${process.env.API_URL}/device_data/get_raw/2?lookback_start=${lookback}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.BEARER_TOKEN}`
                    }
                }
            )
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });

        return deviceData && deviceData.data[0] ? deviceData.data[0].deviceDataPoints : [];
    }
});

export const dataPointsCurrentMeasurementState = selector<DataPoint[]>({
    key: 'dataPointsCurrentMeasurement',
    get: ({ get }) => {
        const dataPoints = get(dataPointsState);
        const currentMeasurement = get(currentMeasurementState);
        return dataPoints.filter((dataPoint) => dataPoint.field == currentMeasurement);
    }
});

export const dataPointsValuesState = selector<number[]>({
    key: 'dataPointsValues',
    get: ({ get }) => {
        const dataPoints = get(dataPointsCurrentMeasurementState);
        return dataPoints.map((dataPoint) => dataPoint.value);
    }
});

export const yAxisMaxValueState = selector<number>({
    key: 'yAxisMaxValue',
    get: ({ get }) => {
        const dataPointValues = get(dataPointsValuesState);
        const maxValue = Math.max(...dataPointValues);

        const currentMeasurement = get(currentMeasurementState);
        const yAxisMaxValue = measurements[currentMeasurement].yAxisMaxValue;

        if (typeof yAxisMaxValue !== 'undefined' && yAxisMaxValue >= maxValue) {
            return yAxisMaxValue;
        }

        return maxValue;
    }
});

export const yAxisMinValueState = selector<number>({
    key: 'yAxisMinValue',
    get: ({ get }) => {
        const dataPointValues = get(dataPointsValuesState);
        const minValue = Math.min(...dataPointValues);

        const currentMeasurement = get(currentMeasurementState);
        const yAxisMinValue = measurements[currentMeasurement].yAxisMinValue;

        if (typeof yAxisMinValue !== 'undefined' && yAxisMinValue <= minValue) {
            return yAxisMinValue;
        }

        return minValue;
    }
});
