import type { MongoClient, Db, Collection } from "mongodb";
import { AuditEvent } from "./types";
import { CreateMongoAdapter } from "./utils/createMongoAdapter";

export class MongoDBAdapter extends CreateMongoAdapter {
  private db!: Db;
  private collection!: Collection;

  constructor(
    private client: MongoClient,
    private dbName: string = "audit",
    private collectionName: string = "audit_events",
    debug = false,
  ) {
    super(
      async () => {
        await client.connect();

        // Get DB reference
        const db = client.db(dbName);

        // Check if collection exists
        const collections = await db
          .listCollections({ name: collectionName })
          .toArray();

        if (collections.length === 0) {
          // Explicitly create collection with optional validation rules (optional)
          await db.createCollection(collectionName, {
            validator: {
              $jsonSchema: {
                bsonType: "object",
                required: ["action"],
                properties: {
                  actorId: { bsonType: ["string", "null"] },
                  action: { bsonType: "string" },
                  entity: { bsonType: ["string", "null"] },
                  entityId: { bsonType: ["string", "null"] },
                  metadata: { bsonType: ["object", "null"] },
                  timestamp: { bsonType: "date" },
                },
              },
            },
          });
        }

        // Save references for insert
        this.db = db;
        this.collection = db.collection(collectionName);

        // Create indexes (e.g., on timestamp for faster queries)
        await this.collection.createIndex({ timestamp: 1 });
      },
      async (event: AuditEvent) => {
        if (!this.collection) {
          this.db = client.db(dbName);
          this.collection = this.db.collection(collectionName);
        }
        return this.collection.insertOne(event);
      },
      debug,
    );
  }
}
