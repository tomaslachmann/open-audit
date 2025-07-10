import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { Pool } from "pg";
import { OpenAudit } from "../../src/audit";

describe("PostgreSQL Adapter (Integration)", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = new Pool({
      connectionString: process.env.TEST_PG_URI,
    });

    await OpenAudit.init({
      provider: "postgresql",
      driver: "pg",
      pool,
      debug: true,
    });
  });

  afterAll(async () => {
    await pool.query("DROP TABLE IF EXISTS audit_events");
    await pool.end();
  });

  it("should write event to PostgreSQL", async () => {
    await OpenAudit.log({
      action: "create",
      entity: "order",
    });

    const res = await pool.query("SELECT * FROM audit_events");
    expect(res.rowCount).toBeGreaterThan(0);
  });
});
