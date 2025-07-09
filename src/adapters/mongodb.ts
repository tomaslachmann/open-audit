import type { MongoClient, Db, Collection } from "mongodb";
import { BaseAdapter } from "./base";
import { AuditEvent } from "./types";

export class MongoDBAdapter extends BaseAdapter {
  private collection!: Collection;
  private db!: Db;

  constructor(
    private client: MongoClient,
    private dbName: string = "audit",
    private collectionName: string = "audit_events",
    debug = false,
  ) {
    super(debug);
    this.client = client;
  }

  async init() {
    try {
      this.logger.info("Connecting to MongoDB...");
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.collection = this.db.collection(this.collectionName);
      this.logger.success(
        `Connected to MongoDB and using ${this.dbName}.${this.collectionName}`,
      );
    } catch (err) {
      this.logger.error("Failed to initialize MongoDB adapter.");
      console.error(err);
      throw err;
    }
  }

  async logEvent(event: AuditEvent) {
    const result = await this.collection.insertOne({
      ...event,
      timestamp: new Date(),
    });

    this.log("Logged event:", result);
    return result;
  }
}
