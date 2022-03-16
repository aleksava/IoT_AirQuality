#include "time.h"
#include "network.h"
#include "sensordata.h"
#include <wire.h>
// #include <Adafruit_BME680.h>
// #include <Adafruit_Sensor.h>
#include <bsec.h>
#include <EEPROM.h>
#include "bme680.h"


#define BME680_CLIENT_ADDR  0x77
// Adafruit_BME680 bme;


#define SAMPLE_SIZE             4
#define DELTA_SAMPLE_TIME_MS    5000


/* Get timestamp from server */
const char* ntpServer = "pool.ntp.org";
unsigned long getTimeNow();


int counter = 0;
Sensordata data[SAMPLE_SIZE];


// Create an object of the class Bsec
Bsec iaqSensor;
String output;


void setup() 
{
  EEPROM.begin(BSEC_MAX_STATE_BLOB_SIZE + 1); // 1st address for the length


  /* Open serial communication */
  Serial.begin(115200);

  while (!Serial);
  Serial.println(F("BME680 test"));

  /* Enable pullup resistors for SDA and SCL */
  digitalWrite(SDA, 1);
  digitalWrite(SCL, 1);
  Wire.begin();

  iaqSensor.begin(BME680_CLIENT_ADDR, Wire);

  checkIaqSensorStatus(iaqSensor);

  loadState(iaqSensor);

  bsec_virtual_sensor_t sensorList[10] = {
    BSEC_OUTPUT_RAW_TEMPERATURE,
    BSEC_OUTPUT_RAW_PRESSURE,
    BSEC_OUTPUT_RAW_HUMIDITY,
    BSEC_OUTPUT_RAW_GAS,
    BSEC_OUTPUT_IAQ,
    BSEC_OUTPUT_STATIC_IAQ,
    BSEC_OUTPUT_CO2_EQUIVALENT,
    BSEC_OUTPUT_BREATH_VOC_EQUIVALENT,
    BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_TEMPERATURE,
    BSEC_OUTPUT_SENSOR_HEAT_COMPENSATED_HUMIDITY,
  };

  Serial.println("trying to sub");
  iaqSensor.updateSubscription(sensorList, 10, BSEC_SAMPLE_RATE_LP);
  checkIaqSensorStatus(iaqSensor);

  // Print the header
  output = "Timestamp [ms], raw temperature [°C], \
            pressure [hPa], raw relative humidity [%], \
            gas [Ohm], IAQ, IAQ accuracy, temperature [°C],\
             relative humidity [%], Static IAQ, CO2 equivalent,\
              breath VOC equivalent";
  Serial.println(output);

  /* Configure the timezone and server api */
  configTime(0, 0, ntpServer);
}

void loop() 
{
  unsigned long time_trigger = millis();
  if (iaqSensor.run()) { // If new data is available
    output = String(time_trigger);
    output += ", " + String(iaqSensor.rawTemperature);
    output += ", " + String(iaqSensor.pressure);
    output += ", " + String(iaqSensor.rawHumidity);
    output += ", " + String(iaqSensor.gasResistance);
    output += ", " + String(iaqSensor.iaq);
    output += ", " + String(iaqSensor.iaqAccuracy);
    output += ", " + String(iaqSensor.temperature);
    output += ", " + String(iaqSensor.humidity);
    output += ", " + String(iaqSensor.staticIaq);
    output += ", " + String(iaqSensor.co2Equivalent);
    output += ", " + String(iaqSensor.breathVocEquivalent);
    Serial.println(output);
    updateState(iaqSensor);
  } else {
    checkIaqSensorStatus(iaqSensor);
  }



  if (counter == 0)
  {
    /* Get time stamp for current reading */
    connectWIFI();
    unsigned long timeNow = getTimeNow();
    while(timeNow == 0)
    {
      delay(500);
      timeNow = getTimeNow();
    }
    data[counter].setTime(timeNow);
    /* Disconnecting wifi and sleeps until next sampling */
    disconnectWIFI();
  }


  // /* Read sensor data */
  // while (! bme.performReading()) 
  // {
  //   Serial.println("Failed to perform reading :(");
  //   delay(1000);
  // }

  // /* Update data array */
  data[counter].updateSensordata(iaqSensor);

  // data[counter].setTemperature(iaqSensor.rawTemperature);
  // data[counter].setPressure(iaqSensor.pressure / 100.0);
  // data[counter].setHumidity(iaqSensor.rawHumidity);
  // data[counter].setGas(iaqSensor.gasResistance / 1000.0);



  counter++;

  /* When we have reached predefined amount of samples, push it to the AWS server */
  if (counter > SAMPLE_SIZE)
  {
    connectAWS();
    publishMessage(data, SAMPLE_SIZE, DELTA_SAMPLE_TIME_MS);
    counter = 0;
    disconnectAWS();
  }

  /* This delay is gonna be changed with deep sleep */
  delay(DELTA_SAMPLE_TIME_MS);
}



unsigned long getTimeNow()
{
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo))
  {
    Serial.println("Failed to obtain time");
    return(0);
  }
  time(&now);
  return now;
}


