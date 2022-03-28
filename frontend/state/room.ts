import axios from 'axios';
import { atom, atomFamily, selector, selectorFamily, waitForAll } from 'recoil';
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
import { roomsState } from './rooms';

export const roomIdState = atom<number | undefined>({
    key: 'roomId',
    default: undefined
});

export const currentMeasurementState = atom<Measurement>({
    key: 'currentMeasurement',
    default: Measurement.Temperature
});

export const lookbackState = atom<Lookback>({
    key: 'lookback',
    default: 1
});

export const devicesState = selector<Device[]>({
    key: 'devices',
    get: async ({ get }) => {
        const rooms = get(roomsState);

        const devices = await Promise.all(
            rooms.map(async (room) => {
                const roomDevices = await axios
                    .get<Device[]>(`${process.env.API_URL}/devices/get_for_room/${room.id}`, {
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

                return roomDevices && roomDevices.data ? roomDevices.data : [];
            })
        );

        return devices.flat();
    }
});

export const roomDevicesState = selectorFamily<Device[], number | undefined>({
    key: 'roomDevices',
    get:
        (roomId) =>
        async ({ get }) => {
            const devices = get(devicesState);
            if (roomId) {
                return devices.filter((device) => device.roomId == roomId);
            }

            return [];
        }
});

export const currentRoomDevicesState = selector<Device[]>({
    key: 'currentRoomDevices',
    get: async ({ get }) => {
        const roomId = get(roomIdState);

        return get(roomDevicesState(roomId));
    }
});

/**
 * Uses roomId as lookup to get a list of deviceIds that are visible
 * All devices in a room are visible by default
 */
export const visibleDevicesState = atomFamily<number[], number | undefined>({
    key: 'visibleDevices',
    default: selectorFamily<number[], number | undefined>({
        key: 'visibleDevicesDefault',
        get:
            (roomId) =>
            async ({ get }) => {
                return get(roomDevicesState(roomId)).map((device) => device.id);
            }
    })
});

export const currentRoomVisibleDevicesState = selector<number[]>({
    key: 'currentRoomVisibleDevices',
    get: ({ get }) => {
        const roomId = get(roomIdState);

        return visibleDevicesState(roomId);
    },
    set: ({ set, get }, newValue) => {
        const roomId = get(roomIdState);

        set(visibleDevicesState(roomId), newValue);
    }
});

interface DataPoints {
    [deviceId: number]: DataPoint[];
}

export const deviceDataPointsState = selectorFamily<DataPoint[], number>({
    key: 'deviceDataPoints',
    get:
        (deviceId) =>
        async ({ get }) => {
            const lookback = get(lookbackState);

            const data = await axios
                .get<DeviceData[]>(
                    `${process.env.API_URL}/device_data/get_raw/${deviceId}?lookback_start=${lookback}`,
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

            return data && data.data[0] ? data.data[0].deviceDataPoints : [];
        }
});

export const dataPointsState = selector<DataPoints>({
    key: 'dataPoints',
    get: async ({ get }) => {
        const roomDevices = get(currentRoomDevicesState);

        return get<DataPoints>(
            waitForAll(
                roomDevices.reduce(
                    (acc, roomDevice) => ({
                        ...acc,
                        [roomDevice.id]: deviceDataPointsState(roomDevice.id)
                    }),
                    {}
                )
            )
        );
    }
});

export const dataPointsCurrentMeasurementState = selector<DataPoints>({
    key: 'dataPointsCurrentMeasurement',
    get: ({ get }) => {
        const dataPoints = get(dataPointsState);
        const currentMeasurement = get(currentMeasurementState);

        return Object.keys(dataPoints).reduce(
            (acc, deviceId) => ({
                ...acc,
                [deviceId]: dataPoints[parseInt(deviceId)].filter(
                    (dataPoint) => dataPoint.field == currentMeasurement
                )
            }),
            {}
        );
    }
});

export const currentValueState = selector<DataPoint | undefined>({
    key: 'currentValue',
    get: async ({ get }) => {
        const dataPoints = get(dataPointsCurrentMeasurementState);

        // TODO: Compute currentValue not only from first device
        const values = dataPoints[parseInt(Object.keys(dataPoints)[0])];

        if (values.length > 0) {
            return values[values.length - 1];
        }
    }
});

export const dataPointsValuesState = selector<number[]>({
    key: 'dataPointsValues',
    get: ({ get }) => {
        const dataPoints = get(dataPointsCurrentMeasurementState);
        return Object.values(dataPoints)
            .map((deviceDataPoints: DataPoint[]) =>
                deviceDataPoints.map((deviceDataPoint) => deviceDataPoint.value)
            )
            .flat();
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
            Object.entries(dataPoints).forEach(
                ([deviceId, deviceDataPoints]: [string, DataPoint[]]) => {
                    const filteredDataPoints = deviceDataPoints.filter((d) => d.field == key);

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
                                    type: NotificationType.OverMaxThreshold,
                                    deviceId: deviceId
                                });
                            } else if (
                                measurement.minThreshold &&
                                newestDataPoint.value < measurement.minThreshold
                            ) {
                                notifications.push({
                                    measurement: key as Measurement,
                                    type: NotificationType.UnderMinThreshold,
                                    deviceId: deviceId
                                });
                            }
                        }
                    }
                }
            );
        });

        return notifications;
    }
});

export const currentNotificationsState = selector<Notification[] | undefined>({
    key: 'currentNotificationState',
    get: ({ get }) => {
        const notifications = get(notificationsState);
        const currentMeasurement = get(currentMeasurementState);

        return notifications.filter((n) => n.measurement === currentMeasurement);
    }
});
