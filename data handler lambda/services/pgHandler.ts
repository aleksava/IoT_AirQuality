
import ServerlessClient from 'serverless-postgres';
import { IDBQueryResult, IDeviceInfo } from '../types';

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

  public async getAllDevicesWithDeviceNameIn(ids : number[]) : Promise<IDBQueryResult<IDeviceInfo>> {
    const text = 'SELECT organization, room, id FROM device WHERE id = ANY ($1)'
    return await this.client.query(text,  [ids]);
  }

}

const pgHandler = new PGHandler();
export default pgHandler;
