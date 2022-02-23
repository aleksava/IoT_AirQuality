#ifndef SENSORDATA_H
#define SENSORDATA_H


/* Class containing data points and time */

class Sensordata
{
  public:
    // Sensordata(void);
    // ~Sensordata(void);
    void setData(float data);
    void setTime(unsigned long time);
    float getData(void);
    unsigned long getTime(void);
    
  private:
    float _data;
    unsigned long _timestamp;
};

#endif