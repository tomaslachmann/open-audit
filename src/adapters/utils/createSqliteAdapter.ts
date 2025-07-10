import type { AdapterInterface, AuditEvent } from "../types";
import { BaseAdapter } from "../base";

export class CreateSqliteAdapter
  extends BaseAdapter
  implements AdapterInterface
{
  private connect: () => Promise<any>;
  private execute: (sql: string, params?: any[]) => Promise<any>;

  constructor(
    connect: () => Promise<void>,
    execute: (sql: string, params?: any[]) => Promise<any>,
    debug = false,
  ) {
    super(debug);
    this.connect = connect;
    this.execute = execute;
  }

  async init() {
    this.logger.info("Initializing SQLite adapter...");
    try {
      await this.connect();
      this.logger.success("Connected to SQLite.");

      await this.execute(`
        CREATE TABLE IF NOT EXISTS audit_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
          actor_id TEXT,
          action TEXT NOT NULL,
          entity TEXT,
          entity_id TEXT,
          metadata TEXT
        );
      `);
      this.logger.success("audit_events table is ready.");
    } catch (err) {
      this.logger.error("Failed to initialize SQLite adapter.");
      console.error(err);
      throw err;
    }
  }

  async logEvent(event: AuditEvent) {
    const sql = `
      INSERT INTO audit_events (actor_id, action, entity, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await this.execute(sql, [
      event.actorId,
      event.action,
      event.entity,
      event.entityId,
      JSON.stringify(event.metadata || {}),
    ]);
    this.log("Logged event:", result);
    return result;
  }
}
