export interface RoomData {
    id: number;
    name: string;
    building: string;
    notificationsOn: boolean;
    notifications: Notification[];
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
}

export enum Measurement {
    Temperature = 'temperature',
    Humidity = 'humidity',
    Pressure = 'pressure',
    AirQuality = 'IAQ',
    CO2 = 'CO2'
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
    yAxisMinValue: number;
    yAxisMaxValue: number;
}

export type Lookback =
    | 3
    | 6
    | 12
    | 24 // 1 day
    | 168 // 1 week (7 days)
    | 336 // 2 weeks (14 days)
    | 720; // 1 month (30 days)
