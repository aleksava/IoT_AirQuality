"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const influxdb_client_1 = require("@influxdata/influxdb-client");
const constants_1 = require("./constants");
// import "./properties"; // Sets envvars for local testing.
const pgHandler_1 = __importDefault(require("./services/pgHandler"));
const expo_server_sdk_1 = require("expo-server-sdk");
let expo = new expo_server_sdk_1.Expo();
const rawDataBucketName = "raw_data_bucket";
var writeApi;
const connectInflux = () => {
    if (process.env.INFLUX_HOSTNAME == null || process.env.INFLUX_TOKEN == null || process.env.INFLUX_ORG == null) {
        throw new Error("Missing required environment variables for connecting/writing to InfluxDB.");
    }
    if (writeApi == null) {
        writeApi = new influxdb_client_1.InfluxDB({ url: process.env.INFLUX_HOSTNAME, token: process.env.INFLUX_TOKEN })
            .getWriteApi(process.env.INFLUX_ORG, rawDataBucketName);
    }
};
const sendNotification = async (roomNotificationSubscriptions, roomId, notification) => {
    const matchingSubscriptions = roomNotificationSubscriptions.filter(subscription => subscription.room == roomId);
    if (matchingSubscriptions.length > 0) {
        let messages = [];
        for (let subscription of matchingSubscriptions) {
            // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
            // Check that all your push tokens appear to be valid Expo push tokens
            if (!expo_server_sdk_1.Expo.isExpoPushToken(subscription.notification_token)) {
                console.error(`Push token ${subscription.notification_token} is not a valid Expo push token`);
                continue;
            }
            // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
            messages.push({
                to: subscription.notification_token,
                sound: 'default',
                body: notification.message,
                data: {
                    deviceId: notification.device_id,
                    roomId: roomId,
                    measurement: notification.measurement
                },
            });
        }
        if (messages.length > 0) {
            let chunks = expo.chunkPushNotifications(messages);
            let tickets = [];
            (async () => {
                // Send the chunks to the Expo push notification service. There are
                // different strategies you could use. A simple one is to send one chunk at a
                // time, which nicely spreads the load out over time:
                for (let chunk of chunks) {
                    try {
                        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                        console.log(ticketChunk);
                        tickets.push(...ticketChunk);
                        // NOTE: If a ticket contains an error code in ticket.details.error, you
                        // must handle it appropriately. The error codes are listed in the Expo
                        // documentation:
                        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            })();
        }
    }
};
exports.handler = async (event, context, callback) => {
    await pgHandler_1.default.connect();
    connectInflux();
    if (writeApi == null) {
        throw new Error("Could not connect properly to InfluxDB.");
    }
    const promiseList = [];
    const roomNotificationsSubscriptions = (await pgHandler_1.default.getAllRoomNotificationSubscriptions()).rows;
    const newNotifications = [];
    const newDeviceTimeouts = {};
    const deviceNotificationTimeouts = {};
    for (const deviceTimeout of (await pgHandler_1.default.getAllDeviceNotificationTimeouts()).rows) {
        deviceNotificationTimeouts[`${deviceTimeout.device_id}_${deviceTimeout.measurement}`] = deviceTimeout;
    }
    console.log("roomNotificationsSubscriptions:", roomNotificationsSubscriptions);
    console.log("deviceNotificationTimeouts:", deviceNotificationTimeouts);
    const deviceIds = [];
    const messages = [];
    for (const record of event.Records) {
        try {
            var message = JSON.parse(record.body);
            console.log("Message: " + JSON.stringify(message));
            // only adding msgDeviceId if not already in id-list (list assumed small, so search per push shouldn't be especially ineficient).
            const msgDeviceId = parseInt(message.device_id);
            if (!deviceIds.includes(msgDeviceId)) {
                deviceIds.push(msgDeviceId);
            }
            messages.push(message);
        }
        catch (error) {
            console.warn("Record has a message with wrong/unexpected format", record);
            console.warn("(throwing away and continuing)");
        }
    }
    console.log("Message Device Ids:", deviceIds);
    const dbDevices = (await pgHandler_1.default.getAllDevicesWithDeviceNameIn(deviceIds)).rows;
    const deviceMergedMessages = [];
    for (const message of messages) {
        const msgDeviceId = parseInt(message.device_id);
        for (const device of dbDevices) {
            if (msgDeviceId == Number(device.id)) {
                deviceMergedMessages.push({
                    payload: message.device_payload,
                    deviceInfo: device
                });
            }
        }
    }
    for (const deviceMessage of deviceMergedMessages) {
        // Finding or setting timestamp - defaults to curtime for transform 
        var serverTimestamp = new Date();
        if (deviceMessage.payload.startMillisUTC != null) {
            const msgTimestamp = parseFloat(deviceMessage.payload.startMillisUTC);
            const tsDiff = serverTimestamp.valueOf() - msgTimestamp;
            if (tsDiff > 0 && tsDiff < 86400000) { // not accepting base values older than 24 hrs or in the futute (requiring UTC)
                for (const [payloadNum, payloadTuple] of deviceMessage.payload.measurements.entries()) {
                    // Iterating over message payload body and pushing each as a point to DB.
                    let point = new influxdb_client_1.Point("measurement")
                        .tag("id", deviceMessage.deviceInfo.id.toString())
                        .tag("org_id", deviceMessage.deviceInfo.organization.toString())
                        .tag("room_id", deviceMessage.deviceInfo.room.toString())
                        .timestamp(new Date(msgTimestamp + payloadNum * deviceMessage.payload.deltaMillis));
                    for (const [index, label] of deviceMessage.payload.measurementLabels.entries()) {
                        try {
                            var numVal = parseFloat(payloadTuple[index]);
                            // Checking if payload should be checked for threshold-break
                            const devicerow = `${deviceMessage.deviceInfo.id}_${label}`;
                            if (constants_1.measurementThresholds[label]
                                && (newDeviceTimeouts[devicerow] == null || newDeviceTimeouts[devicerow].timed_out_until.valueOf() < serverTimestamp.valueOf())
                                && (deviceNotificationTimeouts[devicerow] == null || deviceNotificationTimeouts[devicerow].timed_out_until.valueOf() < serverTimestamp.valueOf())) {
                                // checking threshold
                                const mThres = constants_1.measurementThresholds[label];
                                if (mThres.threshold_high && mThres.threshold_high < numVal) {
                                    const notification = {
                                        device_id: deviceMessage.deviceInfo.id,
                                        measurement: label,
                                        timestamp: serverTimestamp,
                                        message: `Device ${deviceMessage.deviceInfo.id} is above the threshold value for ${label}. Measured ${numVal} with suggested threshold at ${mThres.threshold_high}`
                                    };
                                    newNotifications.push(notification);
                                    sendNotification(roomNotificationsSubscriptions, deviceMessage.deviceInfo.room, notification);
                                    newDeviceTimeouts[devicerow] = {
                                        device_id: deviceMessage.deviceInfo.id,
                                        measurement: label,
                                        timed_out_until: new Date(serverTimestamp.valueOf() + 900000) // timed out for 15 min default
                                    };
                                    console.log("ADDING THESHOLD EXCEEDED NOTIFICATION!");
                                }
                                else if (mThres.threshold_low && mThres.threshold_low > numVal) {
                                    const notification = {
                                        device_id: deviceMessage.deviceInfo.id,
                                        measurement: label,
                                        timestamp: serverTimestamp,
                                        message: `Device ${deviceMessage.deviceInfo.id} is below the threshold value for ${label}. Measured ${numVal} with suggested threshold at ${mThres.threshold_high}`
                                    };
                                    newNotifications.push(notification);
                                    sendNotification(roomNotificationsSubscriptions, deviceMessage.deviceInfo.room, notification);
                                    newDeviceTimeouts[devicerow] = {
                                        device_id: deviceMessage.deviceInfo.id,
                                        measurement: label,
                                        timed_out_until: new Date(serverTimestamp.valueOf() + 900000) // timed out for 15 min default
                                    };
                                    console.log("ADDING BELOW THESHOLD NOTIFICATION!");
                                }
                                else {
                                    console.log(`${numVal} did not break thresholds of l: ${mThres.threshold_low} - h: ${mThres.threshold_high} for measurement: ${label}`);
                                }
                            }
                            if (!constants_1.supportedMeasurementLabels.includes(label.toLowerCase()))
                                continue;
                            point = point.floatField(label, numVal);
                        }
                        catch (error) {
                            console.log("Non-number value encountered - skipping");
                            continue;
                        }
                    }
                    console.log("Writing Point:");
                    console.log(point);
                    writeApi.writePoint(point);
                }
            }
        }
    }
    if (newNotifications.length > 0) {
        promiseList.push(pgHandler_1.default.addDeviceNotifications(newNotifications));
    }
    const newDeviceTimeoutsList = Object.values(newDeviceTimeouts);
    if (newDeviceTimeoutsList.length > 0) {
        promiseList.push(pgHandler_1.default.addDeviceNotificationTimeouts(newDeviceTimeoutsList));
    }
    await Promise.all(promiseList);
    await Promise.all([pgHandler_1.default.clean(), writeApi.flush()]);
    return { status: 200 };
};
/* TESTING BELOW
handler({
  "Records": [
      {
        body: '{\
          "device_payload": {"startMillisUTC":1646225620717,"deltaMillis":3000,"measurementLabels":["CO2","humidity","IAQ","temperature"],"measurements":[[464.9207,54.8162,52.8438,9.4323],[526.8571,55.3284,52.8945,24.0164],[521.5499,54.7113,48.6221,24.2304],[533.9342,54.6587,55.4597,24.0254],[450.8063,53.5518,50.1774,24.2919],[535.0595,54.2343,54.3777,24.4063],[513.4553,54.112,46.4651,24.4106],[463.259,54.4146,53.3072,24.4142],[542.9912,54.4666,51.5669,23.9712],[534.383,54.2848,46.3204,24.5898]]},\
          "device_id": "1" \
        }'
      }
  ]
}, null, null);
*/ 
