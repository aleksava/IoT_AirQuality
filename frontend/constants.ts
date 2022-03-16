import { IMeasurement, Measurement } from './state/types';

export const measurements: { [key in Measurement]: IMeasurement } = {
    [Measurement.Temperature]: {
        name: 'Temperature',
        unit: '°C',
        decimals: 1,
        minThreshold: 20,
        maxThreshold: 26,
        yAxisMinValue: 18,
        yAxisMaxValue: 28
    },
    [Measurement.Humidity]: {
        name: 'Humidity',
        unit: '%',
        decimals: 0,
        minThreshold: 20,
        maxThreshold: 60,
        yAxisMinValue: 0,
        yAxisMaxValue: 80
    },
    // [Measurement.Pressure]: {
    //     name: 'Pressure',
    //     unit: ' hPa',
    //     decimals: 0,
    //     yAxisMaxValue: 0,
    //     yAxisMinValue: 100
    // },
    [Measurement.AirQuality]: {
        name: 'Air Quality',
        unit: '',
        decimals: 0,
        yAxisMinValue: 0,
        yAxisMaxValue: 100
    },
    [Measurement.CO2]: {
        name: 'CO2',
        unit: ' ppb',
        decimals: 0,
        maxThreshold: 1000,
        yAxisMinValue: 0,
        yAxisMaxValue: 1100
    }
};
