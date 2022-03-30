#include "time.h"
#include "network.h"
#include "sensordata.h"
#include <Wire.h>
#include <Adafruit_BME680.h>
#include <Adafruit_Sensor.h>
#include <esp_sleep.h>

#include "Adafruit_PM25AQI.h"

#define SAMPLE_SIZE             4
#define UNIT_DOWN(i)            (i*1000)
#define MS_READ_PERIOD          UNIT_DOWN(30)       
#define US_READ_PERIOD          UNIT_DOWN(UNIT_DOWN(30)) // seconds between each sensor reading


//#define DEBUG

void sleepState(bool deep);

/* Get timestamp from server */
const char* ntpServer = "pool.ntp.org";
time_t getTimeNow();

Adafruit_BME680 bme;

/* Particle sensor datatype */
Adafruit_PM25AQI aqi = Adafruit_PM25AQI();
const int particleSensorSleepPin = 13;

// https://cdn-learn.adafruit.com/downloads/pdf/pmsa003i.pdf

int counter = 0;
Sensordata data[SAMPLE_SIZE];
PM25_AQI_Data data_particle;


void setup() 
{
  /* Open serial communication */
  Serial.begin(115200);

  while (!Serial);

  /* Start particle sensor */
  pinMode(particleSensorSleepPin, OUTPUT); 
  digitalWrite(particleSensorSleepPin, HIGH);

  if (!bme.begin()) {
    Serial.println(F("Could not find a valid BME680 sensor, check wiring!"));
    delay(1000);
  }


  // There are 3 options for connectivity!
  while (!aqi.begin_I2C()) {   
    Serial.println("Could not find PM 2.5 sensor!");
    delay(1000);
  }

  /* Set up oversampling and filter initialization */
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
  /* Start particle sensor */
  digitalWrite(particleSensorSleepPin, HIGH);
  /* 30 sec delay to make the reading properly */
  delay(UNIT_DOWN(30));

  if (counter == 0)
  {
    /* Get time stamp for current reading */
    connectWiFi();
    unsigned long timeNow = getTimeNow();
    while(timeNow == 0)
    {
      delay(1000);
      timeNow = getTimeNow();
    }
    data[counter].setTime(timeNow);
    /* Disconnecting WiFi and sleeps until next sampling */
    disconnectWiFi();
  }

  /* Read sensor data */
  while (!bme.performReading()) 
  {
    Serial.println("Failed to perform reading :(");
    delay(1000);
  }

  while (!aqi.read(&data_particle)) {
    Serial.println("Could not read from AQI");
    delay(1000);  // try again in a bit!
  }

  /* Put particle sensor to sleep */
  digitalWrite(particleSensorSleepPin, LOW);

  #ifdef DEBUG
  Serial.println("AQI reading success");
  Serial.println();
  Serial.println(F("---------------------------------------"));
  Serial.println(F("Concentration Units (standard)"));
  Serial.println(F("---------------------------------------"));
  Serial.print(F("PM 1.0: ")); Serial.print(data_particle.pm10_standard);
  Serial.print(F("\t\tPM 2.5: ")); Serial.print(data_particle.pm25_standard);
  Serial.print(F("\t\tPM 10: ")); Serial.println(data_particle.pm100_standard);
  Serial.println(F("Concentration Units (environmental)"));
  Serial.println(F("---------------------------------------"));
  Serial.print(F("PM 1.0: ")); Serial.print(data_particle.pm10_env);
  Serial.print(F("\t\tPM 2.5: ")); Serial.print(data_particle.pm25_env);
  Serial.print(F("\t\tPM 10: ")); Serial.println(data_particle.pm100_env);
  Serial.println(F("---------------------------------------"));
  Serial.print(F("Particles > 0.3um / 0.1L air:")); Serial.println(data_particle.particles_03um);
  Serial.print(F("Particles > 0.5um / 0.1L air:")); Serial.println(data_particle.particles_05um);
  Serial.print(F("Particles > 1.0um / 0.1L air:")); Serial.println(data_particle.particles_10um);
  Serial.print(F("Particles > 2.5um / 0.1L air:")); Serial.println(data_particle.particles_25um);
  Serial.print(F("Particles > 5.0um / 0.1L air:")); Serial.println(data_particle.particles_50um);
  Serial.print(F("Particles > 10 um / 0.1L air:")); Serial.println(data_particle.particles_100um);
  Serial.println(F("---------------------------------------"));
  #endif

  /* Update data to send */
  data[counter].setTemperature(bme.temperature);
  data[counter].setPressure(bme.pressure / 100.0);
  data[counter].setHumidity(bme.humidity);
  data[counter].setGas(bme.gas_resistance);
  data[counter].updateParticles(data_particle);

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