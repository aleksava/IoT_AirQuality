"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measurementThresholds = exports.supportedMeasurementLabels = void 0;
exports.supportedMeasurementLabels = ["co2", "iaq", "gas", "temperature", "humidity"];
exports.measurementThresholds = {
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
    } /* TODO: ,
    "mold_factor": {
  
    }*/
};
