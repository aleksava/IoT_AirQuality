
import { time } from 'console';
import ServerlessClient from 'serverless-postgres';
import { IDBQueryResult, IDeviceInfo, IDeviceNotificationTimeout, INotification, IRoomNotificationsSubscription } from '../interfaces';
var format = require('pg-format');

class PGHandler {

  private client : ServerlessClient;

  constructor(){
    
    if(process.env.RDS_HOSTNAME == null || process.env.RDS_DB_NAME == null
      || process.env.RDS_USERNAME == null || process.env.RDS_PASSWORD == null){
        throw new Error("Missing required environment variables for connecting to PostreSQL DB.");
    }

    this.client = new ServerlessClient({
      user: process.env.RDS_USERNAME,
      host: process.env.RDS_HOSTNAME,
      database: process.env.RDS_DB_NAME,
      password: process.env.RDS_PASSWORD,
      ssl: { rejectUnauthorized: false },
      port: 5432,
      maxConnections: 2
    });
  }

  public async connect(){
    await this.client.connect();
  }

  public async clean(){
    await this.client.clean();
  }

  public async getAllRoomNotificationSubscriptions() : Promise<IDBQueryResult<IRoomNotificationsSubscription>> {
    // Deleting old notification-timestamps, then retrieving all active
    await this.client.query('DELETE FROM notification_subscription WHERE expires_timestamp < NOW();');
    return await this.client.query('SELECT * FROM notification_subscription');
  }

  public async getAllDeviceNotificationTimeouts() : Promise<IDBQueryResult<IDeviceNotificationTimeout>> {
    // Deleting old notification-timestamps, then retrieving all active
    await this.client.query('DELETE FROM device_measurement_notification_timeout WHERE timed_out_until < NOW();');
    return await this.client.query('SELECT device_id, measurement, timed_out_until FROM device_measurement_notification_timeout');
  }

  public async addDeviceNotificationTimeouts(timeouts : IDeviceNotificationTimeout[]) : Promise<void> {
    console.log("INSERTING:", timeouts, "INTO DB...");
    return await this.client.query(format('INSERT INTO device_measurement_notification_timeout(device_id, measurement, timed_out_until) VALUES %L', timeouts.map(timeout => [timeout.device_id, timeout.measurement, timeout.timed_out_until])));
  }

  public async addDeviceNotifications(notifications : INotification[]) : Promise<void> {
    console.log("INSERTING:", notifications, "INTO DB...");
    return await this.client.query(format('INSERT INTO notification(device_id, measurement, timestamp, message) VALUES %L', notifications.map(notification => [notification.device_id, notification.measurement, notification.timestamp, notification.message])));
  }

  public async getAllDevicesWithDeviceNameIn(ids : number[]) : Promise<IDBQueryResult<IDeviceInfo>> {
    const text = 'SELECT organization, room, id FROM device WHERE id = ANY ($1)'
    return await this.client.query(text,  [ids]);
  }

}

const pgHandler = new PGHandler();
export default pgHandler;
