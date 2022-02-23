import {InfluxDB, Point, HttpError, WriteApi, consoleLogger} from '@influxdata/influxdb-client'
import pgHandler from './services/pgHandler';
import { IDeviceInfo, IDeviceMergedMessage, IMessageBody } from './types';

const rawDataBucketName : string = "raw_data_bucket";
var writeApi: (null|WriteApi);

const connectInflux = () => {
  if(process.env.INFLUX_HOSTNAME == null || process.env.INFLUX_TOKEN == null || process.env.INFLUX_ORG == null){
    throw new Error("Missing required environment variables for connecting/writing to InfluxDB.");
  }
  if(writeApi == null){
    writeApi = new InfluxDB({ url: process.env.INFLUX_HOSTNAME, token: process.env.INFLUX_TOKEN})
      .getWriteApi(process.env.INFLUX_ORG, rawDataBucketName);
  }
}

export const handler = async (event: any, context: any, callback: any) => {

  await pgHandler.connect();
  connectInflux();
  if(writeApi == null){
    throw new Error("Could not connect properly to InfluxDB.");
  }

  const deviceIds : number[] = [];
  const messages : IMessageBody[] = [];
  for (const record of event.Records) {
    try {
      var message : IMessageBody = JSON.parse(record.body);
      console.log("Message: " + JSON.stringify(message));

      // only adding msgDeviceId if not already in id-list (list assumed small, so search per push shouldn't be especially ineficient).
      const msgDeviceId : number = parseInt(message.device_id);
      if(!deviceIds.includes(msgDeviceId)){
        deviceIds.push(msgDeviceId);
      }

      messages.push(message);

    } catch (error){
      console.warn("Record has a message with wrong/unexpected format", record);
      console.warn("(throwing away and continuing)");
    }
  }

  console.log("Message Device Ids:", deviceIds);

  const dbDevices : IDeviceInfo[] = (await pgHandler.getAllDevicesWithDeviceNameIn(deviceIds)).rows;
  const deviceMergedMessages : IDeviceMergedMessage[] = [];

  for(const message of messages){
    const msgDeviceId : number = parseInt(message.device_id);
    for(const device of dbDevices){
      if(msgDeviceId == device.id){
        deviceMergedMessages.push({
          payload: message.device_payload,
          deviceInfo: device
        });
      }
    }
  }

  for(const deviceMessage of deviceMergedMessages){
    
      //finding or setting timestamp - defaults to curtime for transform 
      var timestamp : number = new Date().valueOf();
      if(deviceMessage.payload["timestamp"] != null){
        try {
          const msgTimestamp : number = parseFloat(deviceMessage.payload["timestamp"]);
          const tsDiff : number = timestamp - msgTimestamp;
          if(tsDiff > 0 && tsDiff < 86400000){ // not accepting values older than 24 hrs or in the futute (requiring UTC)
            timestamp = msgTimestamp;
          }
        } catch(e) {
          console.log(e);
        }
      }

      // Iterating over message payload body and pushing each as a point to DB.
      let point : Point = new Point("measurement")
        .tag("id", deviceMessage.deviceInfo.id.toString())
        .tag("org_id", deviceMessage.deviceInfo.organization.toString())
        .tag("room_id", deviceMessage.deviceInfo.room.toString())
        .timestamp(new Date());
      
      for (const [key, value] of Object.entries(deviceMessage.payload)) {

        if(key == "timestamp") continue;
        
        try {
          var numVal = parseFloat(value);
          point = point.floatField(key, numVal);
        } catch(error){
          console.log("Non-number value encountered - skipping");
          continue;
        }
      }
      
      console.log("Writing Point:");
      console.log(point);

      writeApi.writePoint(point);
      
  }

  await Promise.all([pgHandler.clean(), writeApi.flush()]);

  return { status: 200 };
}

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