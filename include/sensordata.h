#ifndef SENSORDATA_H
#define SENSORDATA_H


/* Class containing data points and time */

class Sensordata
{
  public:
    // Sensordata(void);
    // ~Sensordata(void);
    void setTemperature(float temperature);
    void setPressure(float pressure);
    void setHumidity(float humidity);
    void setGas(float gas);
    void setTime(unsigned long time);
    float getTemperature(void);
    float getPressure(void);
    float getHumidity(void);
    float getGas(void);
    unsigned long getTime(void);
    
  private:
    float _temperature;
    float _pressure;
    float _humidity;
    float _gas;
    unsigned long _timestamp;
};

#endif