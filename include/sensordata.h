#ifndef SENSORDATA_H
#define SENSORDATA_H

#include "bsec.h"

/* Class containing data points and time */

class Sensordata
{
  public:
    // Sensordata(void);
    // ~Sensordata(void);
    void updateSensordata(Bsec iaqSensor);
    void setTemperature(float temperature);
    void setPressure(float pressure);
    void setHumidity(float humidity);
    void setGas(float gas);
    void setIaq(float iaq);
    void seteCo2(float eCo2);
    void seteVoc(float eVoc);
    void setTime(unsigned long time);
    float getTemperature(void);
    float getPressure(void);
    float getHumidity(void);
    float getGas(void);
    float getIaq(void);
    float geteCo2(void);
    float geteVoc(void);
    unsigned long getTime(void);
    
  private:
    float _temperature;
    float _pressure;
    float _humidity;
    float _gas;
    float _iaq;
    float _eCo2;
    float _eVoc;
    unsigned long _timestamp;
};

#endif
