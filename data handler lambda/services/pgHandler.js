"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_postgres_1 = __importDefault(require("serverless-postgres"));
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
    async getAllDevicesWithDeviceNameIn(ids) {
        const text = 'SELECT organization, room, id FROM device WHERE id = ANY ($1)';
        return await this.client.query(text, [ids]);
    }
}
const pgHandler = new PGHandler();
exports.default = pgHandler;
