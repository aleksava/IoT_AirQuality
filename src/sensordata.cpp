#include "sensordata.h"


void Sensordata::setTemperature(float temperature)
{
  _temperature = temperature;
}

void Sensordata::setPressure(float pressure)
{
  _pressure = pressure;
}

void Sensordata::setHumidity(float humidity)
{
  _humidity = humidity;
}

void Sensordata::setGas(float gas)
{
  _gas = gas;
}

void Sensordata::setIaq(float iaq)
{
  _iaq = iaq;
}


void Sensordata::setTime(unsigned long time)
{
  _timestamp = time;
}

float Sensordata::getTemperature(void)
{
  return _temperature;
}

float Sensordata::getPressure(void)
{
  return _pressure;
}

float Sensordata::getHumidity(void)
{
  return _humidity;
}

float Sensordata::getGas(void)
{
  return _gas;
}

float Sensordata::getIaq(void)
{
  return _iaq;
}


unsigned long Sensordata::getTime(void)
{
  return _timestamp;
}
