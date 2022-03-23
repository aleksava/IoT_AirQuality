#include "WiFi.h"
#include <WiFiClientSecure.h>
#include <MQTT.h>
#include <ArduinoJson.h>
#include "network.h"
#include "secrets.h"
#include "sensordata.h"

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(2048);


void connectWiFi()
{
  WiFi.disconnect(false);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    delay(100);
    Serial.print(".");
  }
  Serial.println("\nWifi Connected!");
}

void disconnectWiFi()
{
  WiFi.disconnect(true);
  Serial.println("Wifi Disconnected!");
}



void connectAWS()
{
  connectWiFi();
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
    delay(200);
  }

  Serial.println("Found thingname!");
  if(!client.connected()){
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to a topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);

  Serial.println("AWS IoT Connected!");
}

void disconnectAWS()
{
  while((client.disconnect() != LWMQTT_SUCCESS) && \
        (client.disconnect() != false))
        {  }
  Serial.println("AWS IoT Disconnected!");

  disconnectWiFi();
}


void publishMessage(Sensordata data[], uint8_t sample_size, uint16_t delta_sample_time)
{
  StaticJsonDocument<2048> doc;

  /* Add first reading time */
  doc["startMillisUTC"] = data[0].getTime();
  doc["deltaMillis"] = delta_sample_time;

  /* Add list of measurements labels */
  Serial.println("Adding labels");
  JsonArray Jlabel = doc.createNestedArray("measurementLabels");
  Jlabel.add("Temperature");
  Jlabel.add("Pressure");
  Jlabel.add("Humidity");
  Jlabel.add("Rel Air quality");

  /* Add all the measurements */
  Serial.println("Adding elements");
  JsonArray Jmeasurements = doc.createNestedArray("measurements");
  for (int i=0; i < sample_size; i++)
  {
    Jmeasurements[i].add(data[i].getTemperature());
    Jmeasurements[i].add(data[i].getPressure());
    Jmeasurements[i].add(data[i].getHumidity());
    Jmeasurements[i].add(data[i].getIaq());

  }
  Serial.println("Writing data");
  size_t memoryUsed = doc.memoryUsage();
  Serial.println("memory used: "); Serial.println(memoryUsed);
  char jsonBuffer[2048];
  serializeJson(doc, jsonBuffer); // print to client
  serializeJsonPretty(doc, Serial);
  if(!client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer))
  {
    Serial.println("****Failed to SEND ******");
  }
}


/* Printing message */
void messageHandler(String &topic, String &payload) 
{
  Serial.print("callback");
  //Serial.println("incoming: " + topic + " - " + payload);
}
