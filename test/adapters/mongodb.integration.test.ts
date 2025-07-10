import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { MongoClient } from "mongodb";
import { MongoDBAdapter } from "../../src/adapters/mongodb";

let client: MongoClient;

beforeAll(async () => {
  client = new MongoClient(
    process.env.TEST_MONGO_URI || "mongodb://localhost:27017",
  );
  await client.connect();

  const adapter = new MongoDBAdapter(
    client,
    "audit_test",
    "audit_events",
    true,
  );
  await adapter.init();
  globalThis.mongoAdapter = adapter;
});

afterAll(async () => {
  const db = client.db("audit_test");
  await db.dropCollection("audit_events");
  await client.close();
});

it("should insert audit event into MongoDB", async () => {
  const adapter = globalThis.mongoAdapter;
  await adapter.logEvent({
    action: "sync",
    entity: "task",
  });

  const doc = await client
    .db("audit_test")
    .collection("audit_events")
    .findOne({ entity: "task" });

  expect(doc).toMatchObject({ action: "sync" });
});
