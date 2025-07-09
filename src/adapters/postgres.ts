import type { Pool } from "pg";
import { AuditEvent } from "./types";
import { BaseAdapter } from "./base";

export class PostgresAdapter extends BaseAdapter {
  constructor(
    private pool: Pool,
    debug = false,
  ) {
    super(debug);
    this.pool = pool;
  }

  async init() {
    try {
      this.logger.info("Connecting to PostgreSQL...");

      // Step 1: Test connection
      const client = await this.pool.connect();
      client.release();
      this.logger.success("Connected to PostgreSQL.");
      // Step 2: Ensure table exists
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS audit_events (
          id SERIAL PRIMARY KEY,
          timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
          actor_id TEXT,
          action TEXT NOT NULL,
          entity TEXT,
          entity_id TEXT,
          metadata JSONB
        );
      `);
      this.logger.success("audit_events table is ready.");
    } catch (err) {
      this.logger.error("Failed to initialize PostgreSQL adapter.");
      console.error(err);
      throw err;
    }
  }

  async logEvent(event: AuditEvent) {
    const { actorId, action, entity, entityId, metadata } = event;
    const result = await this.pool.query(
      `INSERT INTO audit_events (actor_id, action, entity, entity_id, metadata)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [actorId, action, entity, entityId, metadata || {}],
    );
    this.log("Logged event:", result.rows[0]);

    return result.rows[0];
  }
}
