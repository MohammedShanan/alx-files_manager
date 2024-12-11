import { MongoClient } from 'mongodb';
import envLoader from './env_loader';

class DBClient {
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}`;

    this.databaseName = database;
    this.client = new MongoClient(dbURL, { useUnifiedTopology: true });
    this.connected = false;
    this.initialize();
  }

  async initialize() {
    try {
      await this.client.connect();
      this.connected = true;
      this.db = this.client.db(this.databaseName);
      this.users = this.db.collection('users');
      this.files = this.db.collection('files');
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  }

  isAlive() {
    return this.connected && this.client.topology && this.client.topology.isConnected();
  }

  async nbUsers() {
    if (!this.connected) return 0;
    return this.users.countDocuments();
  }

  async nbFiles() {
    if (!this.connected) return 0;
    return this.files.countDocuments();
  }

  usersCollection() {
    return this.connected ? this.users : null;
  }

  filesCollection() {
    return this.connected ? this.files : null;
  }
}

export const dbClient = new DBClient();
export default dbClient;
