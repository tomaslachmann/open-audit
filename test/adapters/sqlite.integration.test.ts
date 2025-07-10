import { describe, it, expect } from "vitest";
import Database from "better-sqlite3";
import { BetterSqlite3Adapter } from "../../src/adapters/sqlite";

describe("SQLite Adapter (Integration)", () => {
  it("should write audit event to in-memory sqlite", async () => {
    const db = new Database(":memory:");
    const adapter = new BetterSqlite3Adapter(db, true);
    await adapter.init();

    await adapter.logEvent({
      action: "read",
      entity: "config",
    });

    const row = db.prepare("SELECT * FROM audit_events").get();
    expect(row).toMatchObject({ action: "read", entity: "config" });
  });
});
