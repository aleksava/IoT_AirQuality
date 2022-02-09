#include "secrets.h"
#include <WiFiClientSecure.h>
#include <MQTT.h>
#include <ArduinoJson.h>
#include "WiFi.h"
#include <HTTPClient.h>
#include "time.h"


void messageHandler(String &topic, String &payload);


// The MQTT topics that this device should publish/subscribe
#define AWS_IOT_PUBLISH_TOPIC   "root/devices/1/update"
#define AWS_IOT_SUBSCRIBE_TOPIC "root/devices/1/update"

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);


void connectAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  // Create a message handler
  client.onMessage(messageHandler);

  Serial.println("Connecting to AWS IOT");

  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }

  if(!client.connected()){
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to a topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);

  Serial.println("AWS IoT Connected!");
}




/* Class containing data points and time */

class Datapoint
{
  public:
    void setData(float data);
    void setTime(unsigned long time);
  private:
    float _data;
    unsigned long _myTime;
};

/* Make JSON message and send it */

void publishMessage(float data[], unsigned long myTime[])
{
  StaticJsonDocument<1024> doc;
  //JsonArray Jtime = doc.createNestedArray("time");
  JsonArray Jdata = doc.createNestedArray("data");
  //copyArray(data, Jdata);

  /*******************************************
   * 
   * 
   * Figure out how to send a list of datapoint class
   * 
   * 
   * 
   * *****************************************/

  for (int i=0; i < 10; i++)
  {
    Datapoint dataPoint;
    dataPoint.setData(data[i]);
    dataPoint.setTime(myTime[i]);
    Jdata.add(dataPoint);
    // Jtime.add(myTime[i]);
    // if (i == 0)
    // {
    //   Jdata.add(1);
    // }
    // else
    // {
    //   Jdata.add(data[i]);
    // }
  }
  Serial.println("memory used: "); Serial.println(doc.memoryUsage());
  char jsonBuffer[1024];
  serializeJson(doc, jsonBuffer); // print to client
  serializeJsonPretty(doc, Serial);

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}


/* Printing message */

void messageHandler(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
}



int counter = 0;
float data[10];
unsigned long myTime[10];


/* Get timestamp from server */

// NTP server to request epoch time
const char* ntpServer = "pool.ntp.org";

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



void setup() 
{
  Serial.begin(115200);
  configTime(0, 0, ntpServer);
  connectAWS();
}

void loop() 
{
  data[counter] = counter + 1.1;
  myTime[counter] = getTimeNow();

  if (counter >= 10)
  {
    publishMessage(data, myTime);
    counter = 0;
  }


  client.loop();
  delay(1000);
  counter++;
}

