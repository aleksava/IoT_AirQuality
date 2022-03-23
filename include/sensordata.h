#ifndef SENSORDATA_H
#define SENSORDATA_H

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
    float getTemperature(void);
    float getPressure(void);
    float getHumidity(void);
    float getGas(void);
    float getIaq(void);
    unsigned long getTime(void);
    
  private:
    float _temperature;
    float _pressure;
    float _humidity;
    float _gas;
    float _iaq;
    unsigned long _timestamp;
};

#endif
