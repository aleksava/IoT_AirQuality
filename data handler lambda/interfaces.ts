export interface IThreshold {
  threshold_low?: number,
  threshold_high?: number
}

export interface IMeasToThreshold {
  [measName: string] : IThreshold
}

export interface IRoomNotificationsSubscription {
  user_name: string,
  room: BigInt,
  notification_token: string,
  expires_timestamp: Date
}

export interface IDeviceNotificationTimeout {
  device_id: BigInt,
  measurement: string,
  timed_out_until: Date
}

export interface INotification {
  device_id: BigInt,
  measurement: string,
  timestamp: Date,
  message: string
}

export interface IDeviceOutput {
  startMillisUTC: number,
  deltaMillis: number,
  measurementLabels: string[],
  measurements: number[][]
}

export interface IMessageBody {
  device_payload: IDeviceOutput,
  device_id: string
}

export interface IDeviceInfo {
  id: BigInt,
  organization: number,
  room: BigInt
}

export interface IDeviceMergedMessage {
  payload: IDeviceOutput,
  deviceInfo: IDeviceInfo
}

export interface IDBQueryResult<T> {
  rows: T[]
}