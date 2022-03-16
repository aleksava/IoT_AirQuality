import axios from 'axios';
import { atom, selector } from 'recoil';
import {
    Measurement,
    NotificationType,
    Lookback,
    DataPoint,
    DeviceData,
    Device,
    Notification
} from './types';
import { measurements } from '../constants';

export const roomIdState = atom<number | undefined>({
    key: 'roomId',
    default: undefined
});

export const currentMeasurementState = atom<Measurement>({
    key: 'currentMeasurement',
    default: Measurement.Temperature
});

export const roomDevicesState = selector<Device[]>({
    key: 'roomDevices',
    get: async ({ get }) => {
        const roomId = get(roomIdState);

        const devices = await axios
            .get<Device[]>(`${process.env.API_URL}/devices/get_for_room/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.BEARER_TOKEN}`
                }
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });

        return devices && devices.data ? devices.data : [];
    }
});

export const lookbackState = atom<Lookback>({
    key: 'lookback',
    default: 1
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

export const currentValueState = selector<DataPoint | undefined>({
    key: 'currentValue',
    get: async ({ get }) => {
        const dataPoints = get(dataPointsCurrentMeasurementState);

        if (dataPoints.length > 0) {
            return dataPoints[dataPoints.length - 1];
        }
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

export const notificationsState = selector<Notification[]>({
    key: 'notificationsState',
    get: ({ get }) => {
        const dataPoints = get(dataPointsState);

        const notifications: Notification[] = [];

        const twoHoursAgo = Date.now() - 1000 * 60 * 60 * 2;

        Object.entries(measurements).forEach(([key, measurement]) => {
            const filteredDataPoints = dataPoints.filter((d) => d.field == key);

            if (filteredDataPoints.length > 0) {
                const newestDataPoint = filteredDataPoints[filteredDataPoints.length - 1];
                const newestDataPointDate = new Date(newestDataPoint.timestamp);

                // Add notification if newest data point timestamp is within the last two hours
                if (newestDataPointDate.getTime() > twoHoursAgo) {
                    if (
                        measurement.maxThreshold &&
                        newestDataPoint.value > measurement.maxThreshold
                    ) {
                        notifications.push({
                            measurement: key as Measurement,
                            type: NotificationType.OverMaxThreshold
                        });
                    } else if (
                        measurement.minThreshold &&
                        newestDataPoint.value < measurement.minThreshold
                    ) {
                        notifications.push({
                            measurement: key as Measurement,
                            type: NotificationType.UnderMinThreshold
                        });
                    }
                }
            }
        });

        return notifications;
    }
});

export const currentNotificationState = selector<Notification | undefined>({
    key: 'currentNotificationState',
    get: ({ get }) => {
        const notifications = get(notificationsState);
        const currentMeasurement = get(currentMeasurementState);

        return notifications.find((n) => n.measurement === currentMeasurement);
    }
});
