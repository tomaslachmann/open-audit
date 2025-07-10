import "dotenv/config";
import { OpenAudit } from "@arcari/open-audit";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.TEST_MONGO_URI!);
await client.connect();

await OpenAudit.init({
  provider: "mongodb",
  driver: "mongodb",
  client,
  dbName: "audit_test",
  collectionName: "audit_events",
  debug: true,
});

await OpenAudit.log({
  action: "insert",
  entity: "log",
});

