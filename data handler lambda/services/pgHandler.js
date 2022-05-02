"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_postgres_1 = __importDefault(require("serverless-postgres"));
var format = require('pg-format');
class PGHandler {
    constructor() {
        if (process.env.RDS_HOSTNAME == null || process.env.RDS_DB_NAME == null
            || process.env.RDS_USERNAME == null || process.env.RDS_PASSWORD == null) {
            throw new Error("Missing required environment variables for connecting to PostreSQL DB.");
        }
        this.client = new serverless_postgres_1.default({
            user: process.env.RDS_USERNAME,
            host: process.env.RDS_HOSTNAME,
            database: process.env.RDS_DB_NAME,
            password: process.env.RDS_PASSWORD,
            ssl: { rejectUnauthorized: false },
            port: 5432,
            maxConnections: 2
        });
    }
    async connect() {
        await this.client.connect();
    }
    async clean() {
        await this.client.clean();
    }
    async getAllRoomNotificationSubscriptions() {
        // Deleting old notification-timestamps, then retrieving all active
        await this.client.query('DELETE FROM notification_subscription WHERE expires_timestamp < NOW();');
        return await this.client.query('SELECT * FROM notification_subscription');
    }
    async getAllDeviceNotificationTimeouts() {
        // Deleting old notification-timestamps, then retrieving all active
        await this.client.query('DELETE FROM device_measurement_notification_timeout WHERE timed_out_until < NOW();');
        return await this.client.query('SELECT device_id, measurement, timed_out_until FROM device_measurement_notification_timeout');
    }
    async addDeviceNotificationTimeouts(timeouts) {
        console.log("INSERTING:", timeouts, "INTO DB...");
        return await this.client.query(format('INSERT INTO device_measurement_notification_timeout(device_id, measurement, timed_out_until) VALUES %L', timeouts.map(timeout => [timeout.device_id, timeout.measurement, timeout.timed_out_until])));
    }
    async addDeviceNotifications(notifications) {
        console.log("INSERTING:", notifications, "INTO DB...");
        return await this.client.query(format('INSERT INTO notification(device_id, measurement, timestamp, message) VALUES %L', notifications.map(notification => [notification.device_id, notification.measurement, notification.timestamp, notification.message])));
    }
    async getAllDevicesWithDeviceNameIn(ids) {
        const text = 'SELECT organization, room, id FROM device WHERE id = ANY ($1)';
        return await this.client.query(text, [ids]);
    }
}
const pgHandler = new PGHandler();
exports.default = pgHandler;
