import type { Pool } from "mysql2/promise";
import { AuditEvent } from "./types";
import { BaseAdapter } from "./base";

export class MySQLAdapter extends BaseAdapter {
  constructor(
    private pool: Pool,
    debug = false,
  ) {
    super(debug);
    this.pool = pool;
  }

  async init() {
    try {
      this.logger.info("Connecting to MySQL-compatible database...");

      // Step 1: Test connection
      const conn = await this.pool.getConnection();
      conn.release();
      this.logger.success("Connected to MySQL-compatible database.");

      // Step 2: Ensure table exists
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS audit_events (
          id INT AUTO_INCREMENT PRIMARY KEY,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          actor_id TEXT,
          action TEXT NOT NULL,
          entity TEXT,
          entity_id TEXT,
          metadata JSON
        )
      `);

      this.logger.success("audit_events table is ready.");
    } catch (err) {
      this.logger.error("Failed to initialize MySQL adapter.");
      console.error(err);
      throw err;
    }
  }

  async logEvent(event: AuditEvent) {
    const { actorId, action, entity, entityId, metadata } = event;

    const [result] = await this.pool.query(
      `INSERT INTO audit_events (actor_id, action, entity, entity_id, metadata)
       VALUES (?, ?, ?, ?, ?)`,
      [actorId, action, entity, entityId, JSON.stringify(metadata || {})],
    );

    this.log("Logged event:", result);
    return result;
  }
}
