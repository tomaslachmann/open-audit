// createPostgresAdapter.ts
import type { AdapterInterface, AuditEvent } from "../types";
import { BaseAdapter } from "../base";

export class CreatePostgresAdapter
  extends BaseAdapter
  implements AdapterInterface
{
  constructor(
    private connect: () => Promise<any>,
    private execute: (sql: string, values: any[]) => Promise<any>,
    debug = false,
  ) {
    super(debug);
  }

  async init() {
    this.logger.info("Initializing PostgreSQL adapter...");

    try {
      // Step 1: Test connection
      await this.connect();
      this.logger.success("Connected to PostgreSQL.");

      // Step 2: Create table
      await this.createTable();
      this.logger.success("audit_events table is ready.");
    } catch (err) {
      this.logger.error("Failed to initialize PostgreSQL adapter.");
      console.error(err);
      throw err;
    }
  }

  private async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS audit_events (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMPTZ DEFAULT now(),
        actor_id TEXT,
        action TEXT NOT NULL,
        entity TEXT,
        entity_id TEXT,
        metadata JSONB
      );
    `;
    await this.execute(sql, []);
  }

  async logEvent(event: AuditEvent) {
    const sql = `
      INSERT INTO audit_events (actor_id, action, entity, entity_id, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      event.actorId,
      event.action,
      event.entity,
      event.entityId,
      event.metadata || {},
    ];
    const result = await this.execute(sql, values);
    this.log("Logged event:", event);
    return result;
  }
}
