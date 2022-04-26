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
    [Measurement.Pressure]: {
        name: 'Pressure',
        unit: ' hPa',
        decimals: 0,
        yAxisMinValue: 800,
        yAxisMaxValue: 1300
    },
    [Measurement.GasResistance]: {
        name: 'Gas Resistance',
        unit: ' Ω',
        decimals: 0,
        yAxisMinValue: 0,
        yAxisMaxValue: 50000
    },
    [Measurement.PM25]: {
        name: 'PM2.5',
        unit: ' μg/m³',
        decimals: 0,
        yAxisMinValue: 0,
        yAxisMaxValue: 20
    }
};
