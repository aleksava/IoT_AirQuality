#ifndef NETWORK_H
#define NETWORK_H

#include "sensordata.h"
#include <WiFiClientSecure.h>
#include <MQTT.h>

// The MQTT topics that this device should publish/subscribe
#define AWS_IOT_PUBLISH_TOPIC   "root/devices/1/update"
#define AWS_IOT_SUBSCRIBE_TOPIC "root/devices/1/update"

extern WiFiClientSecure net;
extern MQTTClient client;

/* Sets up the WiFi peripheral and connects to WiFi details set in secret.h */
void connectWiFi();
void disconnectWiFi();

/* Connects to AWS following the certificates set in secret.h */
void connectAWS();
void disconnectAWS();

/* Publish Sensordata to the AWS Topic in Json format */
void publishMessage(Sensordata data[], uint8_t sample_size, uint32_t delta_sample_time);

/* Messagehandler used to read incomming data from AWS subscription */
void messageHandler(String &topic, String &payload);


#endif