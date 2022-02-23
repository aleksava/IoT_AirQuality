#include "sensordata.h"


void Sensordata::setData(float data)
{
  _data = data;
}

void Sensordata::setTime(unsigned long time)
{
  _timestamp = time;
}

float Sensordata::getData(void)
{
  return _data;
}

unsigned long Sensordata::getTime(void)
{
  return _timestamp;
}