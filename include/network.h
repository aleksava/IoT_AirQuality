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

/* Sets up the wifi peripheral and connects to wifi details set in secret.h */
void connectWIFI();
void disconnectWIFI();

/* Connects to AWS following the certificates set in secret.h */
void connectAWS();
void disconnectAWS();

/* Publish Sensordata to the AWS Topic in Json format */
void publishMessage(Sensordata data[], uint8_t sample_size);

/* Messagehandler used to read incomming data from AWS subscription */
void messageHandler(String &topic, String &payload);


#endif