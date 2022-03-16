"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CO2_WITH_VARIATIONS = exports.IAQ_WITH_VARIATIONS = exports.HUMIDITY_WITH_VARIATIONS = exports.TEMPERATURE_WITH_VARIATIONS = exports.Sensor = void 0;
class Sensor {
    constructor(fieldName, dataGenerationFunction) {
        this.state = 0;
        this.fieldName = fieldName;
        this.generateValue = () => dataGenerationFunction(this);
    }
}
exports.Sensor = Sensor;
const getSineModelledFunctionWithVariance = (min, max, period, variance = 1) => (sensor => parseFloat(((max - min) / 2 * Math.sin(period * sensor.state++) + (max + min) / 2 + randomNumberBetween(-variance, variance)).toFixed(4)));
const getTimeOfDaySlottedValuesWithVariance = (hourMapFuncton, callingInterval, variance = 1) => (sensor => parseFloat((hourMapFuncton((sensor.state * callingInterval / (24 * 60 * 60 * 1000)) % 24) + randomNumberBetween(-variance, variance)).toFixed(4)));
function randomNumberBetween(min, max) {
    return min + Math.random() * (max - min);
}
exports.TEMPERATURE_WITH_VARIATIONS = (callingInterval) => {
    // Modelling temperature as a sine function with high being a 
    // random number between 15 and 30, and low high-rand(8, 16)
    var high = randomNumberBetween(15, 30);
    var low = high - randomNumberBetween(8, 16);
    var period = 2 * Math.PI * callingInterval / (24 * 60 * 60 * 1000);
    return new Sensor("temperature", getSineModelledFunctionWithVariance(low, high, period, 0.5));
};
exports.HUMIDITY_WITH_VARIATIONS = (callingInterval) => {
    var high = randomNumberBetween(60, 80);
    var low = randomNumberBetween(20, 35);
    var period = 2 * Math.PI * callingInterval / (24 * 60 * 60 * 1000);
    return new Sensor("humidity", getSineModelledFunctionWithVariance(low, high, period));
};
exports.IAQ_WITH_VARIATIONS = (callingInterval) => {
    const hourMapFunction = (hourOfDay) => {
        if (hourOfDay < 7)
            return 50;
        if (hourOfDay < 12)
            return 60 + (hourOfDay - 7) * 10;
        if (hourOfDay < 13)
            return 80;
        if (hourOfDay < 16)
            return 80 + (hourOfDay - 13) * 10;
        return 100 - (hourOfDay - 16) * 7;
    };
    return new Sensor("IAQ", getTimeOfDaySlottedValuesWithVariance(hourMapFunction, callingInterval, 8));
};
exports.CO2_WITH_VARIATIONS = (callingInterval) => {
    const hourMapFunction = (hourOfDay) => {
        if (hourOfDay < 7)
            return 500;
        if (hourOfDay < 12)
            return 600 + (hourOfDay - 7) * 70;
        if (hourOfDay < 13)
            return 800;
        if (hourOfDay < 16)
            return 800 + (hourOfDay - 13) * 10;
        return 900 - (hourOfDay - 16) * 50;
    };
    return new Sensor("CO2", getTimeOfDaySlottedValuesWithVariance(hourMapFunction, callingInterval, 50));
};
