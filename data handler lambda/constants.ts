import { IMeasToThreshold } from "./interfaces";

export const supportedMeasurementLabels : string[] = ["co2", "iaq", "gas", "temperature", "humidity"];

export const measurementThresholds : IMeasToThreshold = {
  "temperature": {
    threshold_low: 20,
    threshold_high: 26
  },
  "temperature_floor": {
    threshold_low: 19,
    threshold_high: 26
  },
  "CO2": {
    threshold_high: 1000
  },
  "IAQ": {
    threshold_high: 150
  }/* TODO: ,
  "mold_factor": {

  }*/
}