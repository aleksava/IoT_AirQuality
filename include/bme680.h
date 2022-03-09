#ifndef BME680_H
#define BME680_H


extern Bsec iaqSensor;

// Helper functions declarations
void checkIaqSensorStatus(Bsec iaqSensor);
void errLeds(void);
void loadState(Bsec iaqSensor);
void updateState(Bsec iaqSensor);


#endif