#include "WiFi.h"
#include <WiFiClientSecure.h>
#include <MQTT.h>
#include <ArduinoJson.h>
#include "network.h"
#include "secrets.h"
#include "sensordata.h"

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(1024);


void connectWIFI()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED){
    delay(100);
    Serial.print(".");
  }

  Serial.println("Wifi Connected!");
}

void disconnectWIFI()
{
  WiFi.disconnect();
  Serial.println("Wifi Disconnected!");
}


void connectAWS()
{
  connectWIFI();
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

void disconnectAWS()
{
  while((client.disconnect() != LWMQTT_SUCCESS) && \
        (client.disconnect() != false))
        {  }
  Serial.println("AWS IoT Disconnected!");

  disconnectWIFI();
}


void publishMessage(Sensordata data[], uint8_t sample_size)
{
  StaticJsonDocument<1024> doc;
  JsonArray Jtime = doc.createNestedArray("time");
  JsonArray Jdata = doc.createNestedArray("temp");

  for (int i=0; i < sample_size; i++)
  {
    Jdata.add(data[i].getData());
    Jtime.add(data[i].getTime());

  }

  size_t memoryUsed = doc.memoryUsage();
  Serial.println("memory used: "); Serial.println(memoryUsed);
  char jsonBuffer[1024];
  serializeJson(doc, jsonBuffer); // print to client
  serializeJsonPretty(doc, Serial);
  if(!client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer))
  {
    Serial.println("****Failed to SEND ******");
  }
}


/* Printing message */

void messageHandler(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);
}
