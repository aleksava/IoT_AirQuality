export interface Room {
    id: number;
    roomName: string;
    organizationId: number;
}

export interface Device {
    id: number;
    deviceName: string;
    lat: number;
    lng: number;
    organizationId: number;
    roomId: number;
}

export interface DataPoint {
    field: string;
    timestamp: number;
    value: number;
}

export interface DeviceData {
    deviceId: string;
    deviceDataPoints: DataPoint[];
}

export interface Notification {
    measurement: Measurement;
    type: NotificationType;
    deviceId: string;
}

export enum Measurement {
    Temperature = 'temperature',
    Humidity = 'humidity',
    Pressure = 'pressure',
    GasResistance = 'gas resistance',
    PM25 = 'particles 2.5um'
}

export enum NotificationType {
    UnderMinThreshold = 'UNDER_MIN_THRESHOLD',
    OverMaxThreshold = 'OVER_MAX_THRESHOLD'
}

export interface IMeasurement {
    name: string;
    unit?: string;
    decimals: number;
    minThreshold?: number;
    maxThreshold?: number;
    yAxisMinValue?: number;
    yAxisMaxValue?: number;
}

export type Lookback =
    | 1
    | 3
    | 6
    | 12
    | 24 // 1 day
    | 168 // 1 week (7 days)
    | 336 // 2 weeks (14 days)
    | 720; // 1 month (30 days)
