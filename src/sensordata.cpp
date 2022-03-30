#include "sensordata.h"

void Sensordata::updateParticles(PM25_AQI_Data data_particle)
{
  _particles_03um  = data_particle.particles_03um;
  _particles_05um  = data_particle.particles_05um;
  _particles_10um  = data_particle.particles_10um;
  _particles_25um  = data_particle.particles_25um;
  _particles_100um  = data_particle.particles_100um;
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

uint16_t Sensordata::getParticles03um(void)
{
  return _particles_03um;
}

uint16_t Sensordata::getParticles05um(void)
{
  return _particles_05um;
}

uint16_t Sensordata::getParticles10um(void)
{
  return _particles_10um;
}

uint16_t Sensordata::getParticles25um(void)
{
  return _particles_25um;
}

uint16_t Sensordata::getParticles100um(void)
{ 
  return _particles_100um;
}



unsigned long Sensordata::getTime(void)
{
  return _timestamp;
}
