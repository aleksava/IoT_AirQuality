import { Sensor } from "./Sensor";
import { device } from 'aws-iot-device-sdk';
import { IDeviceOutput } from "./interfaces";

export class Device {
  
  id: number;
  sensors: Sensor[];
  
  callingInterval: number;
  pushBatchSize: number; // How many measurements to take before pushing to AWS IoT

  message: IDeviceOutput;

  constructor(id: number, sensors: Sensor[], callingInterval: number, pushBatchSize: number = 10){
    this.id = id;
    this.sensors = sensors.sort((s1, s2) => s1.fieldName.localeCompare(s2.fieldName));
    
    this.callingInterval = callingInterval;
    this.pushBatchSize = pushBatchSize;

    this.message = this.getEmptyMessage();
  }

  getEmptyMessage = () : IDeviceOutput => ({
      startMillisUTC: new Date().valueOf(),
      deltaMillis: this.callingInterval,
      measurementLabels: this.sensors.map(sensor => sensor.fieldName),
      measurements: []
    }
  )

  generateMeasurement = () => {
    const measurements : number[] = [];
    for(const sensor of this.sensors){
      measurements.push(sensor.generateValue());
    }
    this.message.measurements.push(measurements);

    if(this.message.measurements.length >= this.pushBatchSize){
      this.pushMessage();
    }

    // console.log("Message so far:", this.message);
    
    setTimeout(this.generateMeasurement, this.callingInterval);
  }

  pushMessage = () => {
    const awsIoTDevice = new device({
      keyPath: `./certs/${this.id}/private_key.pem`,
      certPath: `./certs/${this.id}/certificate.pem`,
      caPath: './certs/AmazonRootCA1.pem',
      clientId: "" + this.id,
      host: 'a28nk9ufx55fmj-ats.iot.eu-central-1.amazonaws.com'
    });

    awsIoTDevice.on('connect', () => {
      console.log(`Client for thing ${this.id} connected! Starting to simulate messages.`);

      const topic = `root/devices/${this.id}/update`;

      awsIoTDevice.publish(topic, JSON.stringify(this.message), {}, (err: any) => {
        if (err) {
          console.log('Got error:', err);
        } else {
          console.log(`Sent a simulated message to the topic ${topic}!`);
          console.log('Message:', this.message);
        }

        // resetting message and ending connection.
        this.message = this.getEmptyMessage();
        awsIoTDevice.end();
      });
    });
    awsIoTDevice.on("close", () => {
      console.log(`Device connection closed for thing ${this.id}`);
    });
    awsIoTDevice.on('error', (error) => {
      console.log(`Error for thing ${this.id}: ${error}`);
      awsIoTDevice.end();
    });
  } 

}