import { Device } from "./Device";
import { CO2_WITH_VARIATIONS, HUMIDITY_WITH_VARIATIONS, IAQ_WITH_VARIATIONS, Sensor, TEMPERATURE_WITH_VARIATIONS } from "./Sensor";

// const CALLING_INTERVAL_MS = 360000; //update every 6 mins.
const CALLING_INTERVAL_MS = 60000; //update every min.

const device2 = new Device(2, [
  CO2_WITH_VARIATIONS(CALLING_INTERVAL_MS), 
  IAQ_WITH_VARIATIONS(CALLING_INTERVAL_MS),
  TEMPERATURE_WITH_VARIATIONS(CALLING_INTERVAL_MS),
  HUMIDITY_WITH_VARIATIONS(CALLING_INTERVAL_MS)
], CALLING_INTERVAL_MS);

const device3 = new Device(3, [
  CO2_WITH_VARIATIONS(CALLING_INTERVAL_MS), 
  IAQ_WITH_VARIATIONS(CALLING_INTERVAL_MS),
  TEMPERATURE_WITH_VARIATIONS(CALLING_INTERVAL_MS),
  HUMIDITY_WITH_VARIATIONS(CALLING_INTERVAL_MS)
], CALLING_INTERVAL_MS);

device2.generateMeasurement();
device3.generateMeasurement();