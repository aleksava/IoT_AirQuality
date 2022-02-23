export interface IThreshold {
  threshold_low?: number,
  threshold_high?: number
}

export interface IMeasToThreshold {
  [measName: string] : IThreshold
}

export interface IMessageBody {
  device_payload: {
    [measurement_name: string]: any
  },
  device_id: string
}

export interface IDeviceInfo {
  id: number,
  organization: number,
  room: number
}

export interface IDeviceMergedMessage {
  payload:  {
    [measurement_name: string]: any
  },
  deviceInfo: IDeviceInfo
}

export interface IDBQueryResult<T> {
  rows: T[]
}