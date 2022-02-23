#include "time.h"
#include "network.h"
#include "sensordata.h"
#include <wire.h>
#include "MCP9800.h"


#define SAMPLE_SIZE 10


/* Get timestamp from server */
const char* ntpServer = "pool.ntp.org";
unsigned long getTimeNow();


int counter = 0;
Sensordata data[10];

uint32_t samplingTimeSeconds(uint16_t seconds)
{
  return seconds*1000;
}


void setup() 
{
  /* Enable pullup resistors for SDA and SCL */
  digitalWrite(SDA, 1);
  digitalWrite(SCL, 1);
  Wire.begin();

  /* Open serial communication */
  Serial.begin(115200);

  /* Configure the timezone and server api */
  configTime(0, 0, ntpServer);
}

void loop() 
{
  /* Get time stamp for current reading */
  connectWIFI();
  unsigned long timeNow = getTimeNow();
  while(timeNow == 0)
  {
    delay(200);
    timeNow = getTimeNow();
  }

  /* Update data array */
  data[counter].setTime(timeNow);
  data[counter].setData(readTemp());

  counter++;

  /* When we have reached predefined amount of samples, push it to the AWS server */
  if (counter > SAMPLE_SIZE)
  {
    connectAWS();
    publishMessage(data, SAMPLE_SIZE);
    counter = 0;
    disconnectAWS();
  }


  /* Disconnecting wifi and sleeps until next sampling */
  disconnectWIFI();
  /* This delay is gonna be changed with deep sleep */
  delay(samplingTimeSeconds(20));
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


