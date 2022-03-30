#include <EEPROM.h>
#include <bsec.h>
#include "bme688.h"




bool CheckSensor(Bsec iaqSensor) {
  if (iaqSensor.status < BSEC_OK) {
    Serial.printf("BSEC error, status %d!", iaqSensor.status);
    return false;;
  } else if (iaqSensor.status > BSEC_OK) {
    Serial.printf("BSEC warning, status %d!", iaqSensor.status);
  }

  if (iaqSensor.bme680Status < BME680_OK) {
    Serial.printf("iaqSensor error, bme688_status %d!", iaqSensor.bme680Status);
    return false;
  } else if (iaqSensor.bme680Status > BME680_OK) {
    Serial.printf("iaqSensor warning, status %d!", iaqSensor.bme680Status);
  }

  return true;
}

void updateState(uint16_t& stateUpdateCounter, uint8_t bsecState[], Bsec& iaqSensor, uint32_t STATE_SAVE_PERIOD)
{
  bool update = false;
  /* Set a trigger to save the state. Here, the state is saved every STATE_SAVE_PERIOD with the first state being saved once the algorithm achieves full calibration, i.e. iaqAccuracy = 3 */
  if (stateUpdateCounter == 0) {
    if (iaqSensor.iaqAccuracy >= 3) 
    {
      update = true;
      stateUpdateCounter++;
    }
  } 
  else {
    /* Update every STATE_SAVE_PERIOD milliseconds */
    if ((stateUpdateCounter * STATE_SAVE_PERIOD) < millis()) 
    {
      update = true;
      stateUpdateCounter++;
    }
    
  }
    if (update) {
    iaqSensor.getState(bsecState);
    CheckSensor(iaqSensor);

    Serial.println("Writing state to EEPROM");

    for (uint8_t i = 0; i < BSEC_MAX_STATE_BLOB_SIZE ; i++) {
      EEPROM.write(i + 1, bsecState[i]);
      Serial.println(bsecState[i], HEX);
    }

    EEPROM.write(0, BSEC_MAX_STATE_BLOB_SIZE);
    EEPROM.commit();
    }
}



void loadState(uint8_t bsecState[], Bsec& iaqSensor)
{
  if (EEPROM.read(0) == BSEC_MAX_STATE_BLOB_SIZE) {
    // Existing state in EEPROM
    Serial.println("Reading state from EEPROM");

    for (uint8_t i = 0; i < BSEC_MAX_STATE_BLOB_SIZE; i++) {
      bsecState[i] = EEPROM.read(i + 1);
      Serial.println(bsecState[i], HEX);
    }

    iaqSensor.setState(bsecState);
    CheckSensor(iaqSensor);
  } else {
    // Erase the EEPROM with zeroes
    Serial.println("Erasing EEPROM");

    for (uint8_t i = 0; i < BSEC_MAX_STATE_BLOB_SIZE + 1; i++)
      EEPROM.write(i, 0);

    EEPROM.commit();
  }
}