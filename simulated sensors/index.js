"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Device_1 = require("./Device");
const Sensor_1 = require("./Sensor");
// const CALLING_INTERVAL_MS = 360000; //update every 6 mins.
const CALLING_INTERVAL_MS = 60000; //update every min.
const device2 = new Device_1.Device(2, [
    Sensor_1.CO2_WITH_VARIATIONS(CALLING_INTERVAL_MS),
    Sensor_1.IAQ_WITH_VARIATIONS(CALLING_INTERVAL_MS),
    Sensor_1.TEMPERATURE_WITH_VARIATIONS(CALLING_INTERVAL_MS),
    Sensor_1.HUMIDITY_WITH_VARIATIONS(CALLING_INTERVAL_MS)
], CALLING_INTERVAL_MS);
const device3 = new Device_1.Device(3, [
    Sensor_1.CO2_WITH_VARIATIONS(CALLING_INTERVAL_MS),
    Sensor_1.IAQ_WITH_VARIATIONS(CALLING_INTERVAL_MS),
    Sensor_1.TEMPERATURE_WITH_VARIATIONS(CALLING_INTERVAL_MS),
    Sensor_1.HUMIDITY_WITH_VARIATIONS(CALLING_INTERVAL_MS)
], CALLING_INTERVAL_MS);
device2.generateMeasurement();
device3.generateMeasurement();
