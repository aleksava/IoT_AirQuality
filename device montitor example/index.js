var awsIot = require('aws-iot-device-sdk');

const device_identifier = "main_sensor";

const monitorDevice = new awsIot.device({
  keyPath: './certs/' + device_identifier + '/private_key.pem',
  certPath: './certs/' + device_identifier + '/certificate.pem',
  caPath: './certs/AmazonRootCA1.pem',
  clientId: "logger_" + Math.random() * 1000,
  host: 'a28nk9ufx55fmj-ats.iot.eu-central-1.amazonaws.com'
});

monitorDevice.on('connect', () => {
  console.log(`Client for thing ${device_identifier} connected! Starting to listen for updates.`);

  monitorDevice.subscribe(`root/devices/#`);
  monitorDevice.on('message', function(topic, messageBuffer) {
    const message = JSON.parse(Buffer.from(messageBuffer).toString());
        
    // Handle each message however you want here 
    console.log(message);
  });
});

monitorDevice.on("close" | "reconnect" | "offline", () => {
  console.log(`Device connection failed for thing ${device_identifier}`);
});
monitorDevice.on('error', (error) => {
  console.log(`Error for thing ${device_identifier}: ${error}`);
});
monitorDevice.on('message', (topic, payload) => {
  console.log(`Error for thing ${device_identifier}: ${payload}`);
});