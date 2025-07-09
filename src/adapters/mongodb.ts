import { MongoClient, Db, Collection } from "mongodb";
import { BaseAdapter } from "./base";
import { AuditEvent } from "./types";

export class MongoDBAdapter extends BaseAdapter {
  private client: MongoClient;
  private db!: Db;
  private collection!: Collection;

  constructor(
    private url: string,
    private dbName: string = "audit",
    private collectionName: string = "audit_events",
    debug = false,
  ) {
    super(debug);
    this.client = new MongoClient(url);
  }

  async init() {
    try {
      this.log.info("Connecting to MongoDB...");
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.collection = this.db.collection(this.collectionName);
      this.log.success(
        `Connected to MongoDB and using ${this.dbName}.${this.collectionName}`,
      );
    } catch (err) {
      this.log.error("Failed to initialize MongoDB adapter.");
      console.error(err);
      throw err;
    }
  }

  async logEvent(event: AuditEvent) {
    const result = await this.collection.insertOne({
      ...event,
      timestamp: new Date(),
    });

    this.log.debug("Logged event:", result);
    return result;
  }
}
