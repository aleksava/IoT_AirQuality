#ifndef BME688_H
#define BME688_H


/* Configure the BSEC library with information about the sensor
    18v/33v = Voltage at Vdd. 1.8V or 3.3V
    3s/300s = BSEC operating mode, BSEC_SAMPLE_RATE_LP or BSEC_SAMPLE_RATE_ULP
    4d/28d = Operating age of the sensor in days
    generic_18v_3s_4d
    generic_18v_3s_28d
    generic_18v_300s_4d
    generic_18v_300s_28d
    generic_33v_3s_4d
    generic_33v_3s_28d
    generic_33v_300s_4d
    generic_33v_300s_28d
*/

const uint8_t bsec_config_iaq[] = {
#include "config/generic_33v_3s_4d/bsec_iaq.txt"
};


extern Bsec iaqSensor;

// Helper functions declarations
bool CheckSensor(Bsec iaqSensor);
void loadState(uint8_t bsecState[], Bsec& iaqSensor);
void updateState(uint16_t& stateUpdateCounter, uint8_t bsecState[], Bsec& iaqSensor, uint32_t STATE_SAVE_PERIOD);


#endif