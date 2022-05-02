import { Device, DeviceData } from '../state/types';
import apiClient from './api';

export const DevicesService = {
    getDevicesInRoom: (roomId: number) =>
        apiClient
            .get<Device[]>(`/devices/get_for_room/${roomId}`)
            .then((response) => response.data),

    getDeviceData: (deviceId: number, lookback: number) =>
        apiClient
            .get<DeviceData[]>(`/device_data/get_raw/${deviceId}?lookback_start=${lookback}`)
            .then((response) => response.data)
};
