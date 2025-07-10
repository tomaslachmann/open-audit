import { describe, it, beforeAll, afterAll, expect } from "vitest";
import mysql from "mysql2/promise";
import { MySQL2Adapter } from "../../src/adapters/mysql2";

describe("MySQL2 Adapter (Integration)", () => {
  let pool: mysql.Pool;
  let adapter: MySQL2Adapter;

  beforeAll(async () => {
    pool = mysql.createPool({
      uri: process.env.TEST_MYSQL_URI,
    });

    adapter = new MySQL2Adapter(pool, true);
    await adapter.init();
  });

  afterAll(async () => {
    await pool.query("DROP TABLE IF EXISTS audit_events");
    await pool.end();
  });

  it("should write event to MySQL", async () => {
    await adapter.logEvent({
      action: "delete",
      entity: "session",
    });

    const [rows] = await pool.query("SELECT * FROM audit_events");
    expect((rows as any[]).length).toBeGreaterThan(0);
  });
});
