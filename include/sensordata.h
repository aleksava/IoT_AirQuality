#ifndef SENSORDATA_H
#define SENSORDATA_H

#include "Adafruit_PM25AQI.h"

/* Class containing data points and time */

class Sensordata
{
  public:
    void setTemperature(float temperature);
    void setPressure(float pressure);
    void setHumidity(float humidity);
    void setGas(float gas);
    void setIaq(float iaq);
    void setTime(unsigned long time);
    void updateParticles(PM25_AQI_Data data_particle);
    float getTemperature(void);
    float getPressure(void);
    float getHumidity(void);
    float getGas(void);
    float getIaq(void);
    uint16_t getParticles03um(void);
    uint16_t getParticles05um(void);
    uint16_t getParticles10um(void);
    uint16_t getParticles25um(void);
    uint16_t getParticles100um(void);
    unsigned long getTime(void);
    
  private:
    float _temperature;
    float _pressure;
    float _humidity;
    float _gas;
    float _iaq;
    uint16_t _particles_03um;
    uint16_t _particles_05um;
    uint16_t _particles_10um;
    uint16_t _particles_25um;
    uint16_t _particles_100um;

    unsigned long _timestamp;
};

#endif
