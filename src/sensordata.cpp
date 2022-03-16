#include "sensordata.h"


void Sensordata::updateSensordata(Bsec iaqSensor)
{
  if (iaqSensor.iaqAccuracy >= 1)
  {
    setIaq(iaqSensor.iaq);
    seteCo2(iaqSensor.co2Equivalent);
    seteVoc(iaqSensor.breathVocEquivalent);
  }
  else
  {
    setTemperature(iaqSensor.temperature);
    setPressure(iaqSensor.pressure / 100.0);
    setHumidity(iaqSensor.humidity);
    setGas(iaqSensor.gasResistance / 1000.0);
    setIaq(0);
    seteCo2(0);
    seteVoc(0);
    }
}

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

void Sensordata::seteCo2(float eCo2)
{
  _eCo2 = eCo2;
}

void Sensordata::seteVoc(float eVoc)
{
  _eVoc = eVoc;
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

float Sensordata::geteCo2(void)
{
  return _eCo2;
}

float Sensordata::geteVoc(void)
{
  return _eVoc;
}

unsigned long Sensordata::getTime(void)
{
  return _timestamp;
}
