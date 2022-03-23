#include "time.h"
#include "network.h"
#include "sensordata.h"
#include <Wire.h>
#include <Adafruit_BME680.h>
#include <Adafruit_Sensor.h>
#include <esp_sleep.h>


#define SAMPLE_SIZE             4
#define UNIT_DOWN(i)            (i*1000)
#define MS_READ_PERIOD          UNIT_DOWN(15)       
#define US_READ_PERIOD          UNIT_DOWN(UNIT_DOWN(15)) // seconds between each sensor reading


void sleepState(bool deep);

/* Get timestamp from server */
const char* ntpServer = "pool.ntp.org";
time_t getTimeNow();

Adafruit_BME680 bme;
int counter = 0;
Sensordata data[SAMPLE_SIZE];



void setup() 
{
  /* Open serial communication */
  Serial.begin(115200);

  while (!Serial);
  Serial.println(F("BME680 test"));



  if (!bme.begin()) {
    Serial.println(F("Could not find a valid BME680 sensor, check wiring!"));
    while (1);
  }

  // Set up oversampling and filter initialization
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320*C for 150 ms


  /* Configure the timezone and server api */
  configTime(0, 0, ntpServer);
}

void loop() 
{
  if (counter == 0)
  {
    /* Get time stamp for current reading */
    connectWiFi();
    unsigned long timeNow = getTimeNow();
    while(timeNow == 0)
    {
      delay(500);
      timeNow = getTimeNow();
    }
    data[counter].setTime(timeNow);
    /* Disconnecting WiFi and sleeps until next sampling */
    disconnectWiFi();
  }

  /* Read sensor data */
  while (! bme.performReading()) 
  {
    Serial.println("Failed to perform reading :(");
    delay(1000);
  }

  /* Update data to send */
  data[counter].setTemperature(bme.temperature);
  data[counter].setPressure(bme.pressure / 100.0);
  data[counter].setHumidity(bme.humidity);
  float comp_gas = log(bme.gas_resistance) + 0.04 * bme.humidity;
  float IAQ = (1 - (comp_gas/100)) * 500;
  data[counter].setIaq(comp_gas);


  counter++;

  /* When we have reached predefined amount of samples, push it to the AWS server */
  if (counter > SAMPLE_SIZE)
  {
    connectAWS();
    publishMessage(data, SAMPLE_SIZE, MS_READ_PERIOD);
    counter = 0;
    disconnectAWS();
    sleepState(true);
  }
  else
  {
    sleepState(false);
  }
}

time_t getTimeNow()
{
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo))
  {
    Serial.println("Failed to obtain time");
    return(0);
  }
  return mktime(&timeinfo);
}



void sleepState(bool deep)
{
  disconnectWiFi();
  Serial.flush();

  /* Disabling all wakeup sources, so that only the timer (enabled again
   * further down) may wake the sleep */
  esp_sleep_disable_wakeup_source(ESP_SLEEP_WAKEUP_ALL);

  /* Only the RTC is needed for sleep wakeup, so all RTC peripherals
   * can be powered down during sleep */
  esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_OFF);

  if(deep)
  {
    esp_sleep_enable_timer_wakeup(US_READ_PERIOD);
    esp_deep_sleep_start();
  }

  else
  {
    esp_sleep_enable_timer_wakeup(US_READ_PERIOD);
    esp_light_sleep_start();
  }
}