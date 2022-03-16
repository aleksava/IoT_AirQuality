export class Sensor {

  state: number;
  fieldName: string;
  generateValue: () => number;

  constructor(fieldName: string, dataGenerationFunction: (sensor: Sensor) => number){
    this.state = 0;
    this.fieldName = fieldName;
    this.generateValue = () => dataGenerationFunction(this);
  }

}

const getSineModelledFunctionWithVariance = (min: number, max: number, period: number, variance: number = 1) 
: ((sensor: Sensor) => number) => (sensor => 
  parseFloat(((max-min)/2 * Math.sin(period*sensor.state++) + (max+min)/2 + randomNumberBetween(-variance, variance)).toFixed(4))
);

const getTimeOfDaySlottedValuesWithVariance = (hourMapFuncton: (hourOfDay: number) => number, callingInterval: number, variance: number = 1) 
  : ((sensor: Sensor) => number) => (sensor => 
    parseFloat((hourMapFuncton((sensor.state*callingInterval/(24*60*60*1000)) % 24) + randomNumberBetween(-variance, variance)).toFixed(4))
);

function randomNumberBetween (min: number, max: number) {
  return min + Math.random() * (max - min);
}

export const TEMPERATURE_WITH_VARIATIONS = (callingInterval: number) : Sensor => {
  // Modelling temperature as a sine function with high being a 
  // random number between 15 and 30, and low high-rand(8, 16)
  var high = randomNumberBetween(15, 30);
  var low = high - randomNumberBetween(8, 16);
  var period = 2*Math.PI*callingInterval/(24*60*60*1000);
  
  return new Sensor("temperature", getSineModelledFunctionWithVariance(low, high, period, 0.5))
}

export const HUMIDITY_WITH_VARIATIONS = (callingInterval: number) : Sensor => {
  var high = randomNumberBetween(60, 80);
  var low = randomNumberBetween(20, 35);
  var period = 2*Math.PI*callingInterval/(24*60*60*1000);
  
  return new Sensor("humidity", getSineModelledFunctionWithVariance(low, high, period))
}

export const IAQ_WITH_VARIATIONS = (callingInterval: number) : Sensor => {

  const hourMapFunction = (hourOfDay: number) => {
    if(hourOfDay < 7) return 50;
    if(hourOfDay < 12) return 60 + (hourOfDay-7) * 10; 
    if(hourOfDay < 13) return 80; 
    if(hourOfDay < 16) return 80 + (hourOfDay - 13) * 10; 

    return 100 - (hourOfDay - 16) * 7;
  }

  return new Sensor("IAQ", getTimeOfDaySlottedValuesWithVariance(hourMapFunction, callingInterval, 8));
}

export const CO2_WITH_VARIATIONS = (callingInterval: number) : Sensor => {

  const hourMapFunction = (hourOfDay: number) => {
    if(hourOfDay < 7) return 500;
    if(hourOfDay < 12) return 600 + (hourOfDay-7) * 70; 
    if(hourOfDay < 13) return 800; 
    if(hourOfDay < 16) return 800 + (hourOfDay - 13) * 10; 

    return 900 - (hourOfDay - 16) * 50;
  }
  
  return new Sensor("CO2", getTimeOfDaySlottedValuesWithVariance(hourMapFunction, callingInterval, 50));
}