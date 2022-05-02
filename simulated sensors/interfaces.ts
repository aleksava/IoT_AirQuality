export interface IDeviceOutput {
  startMillisUTC: number,
  deltaMillis: number,
  measurementLabels: string[],
  measurements: number[][]
}