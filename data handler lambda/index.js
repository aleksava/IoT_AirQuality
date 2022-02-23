"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const influxdb_client_1 = require("@influxdata/influxdb-client");
const pgHandler_1 = __importDefault(require("./services/pgHandler"));
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
exports.handler = async (event, context, callback) => {
    await pgHandler_1.default.connect();
    connectInflux();
    if (writeApi == null) {
        throw new Error("Could not connect properly to InfluxDB.");
    }
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
            if (msgDeviceId == device.id) {
                deviceMergedMessages.push({
                    payload: message.device_payload,
                    deviceInfo: device
                });
            }
        }
    }
    for (const deviceMessage of deviceMergedMessages) {
        //finding or setting timestamp - defaults to curtime for transform 
        var timestamp = new Date().valueOf();
        if (deviceMessage.payload["timestamp"] != null) {
            try {
                const msgTimestamp = parseFloat(deviceMessage.payload["timestamp"]);
                const tsDiff = timestamp - msgTimestamp;
                if (tsDiff > 0 && tsDiff < 86400000) { // not accepting values older than 24 hrs or in the futute (requiring UTC)
                    timestamp = msgTimestamp;
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        // Iterating over message payload body and pushing each as a point to DB.
        let point = new influxdb_client_1.Point("measurement")
            .tag("id", deviceMessage.deviceInfo.id.toString())
            .tag("org_id", deviceMessage.deviceInfo.organization.toString())
            .tag("room_id", deviceMessage.deviceInfo.room.toString())
            .timestamp(new Date());
        for (const [key, value] of Object.entries(deviceMessage.payload)) {
            if (key == "timestamp")
                continue;
            try {
                var numVal = parseFloat(value);
                point = point.floatField(key, numVal);
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
    await Promise.all([pgHandler_1.default.clean(), writeApi.flush()]);
    return { status: 200 };
};
/* TESTING BELOW

handler({
  "Records": [
    {
      "body": '{\
        "device_payload": {\
            "temperature": 19,\
            "humidity": 54\
        },\
        "device_id": "1"\
      }'
    }
  ]
}, null, null);

*/ 
