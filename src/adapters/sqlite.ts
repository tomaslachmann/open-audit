import Database from "better-sqlite3";
import { BaseAdapter } from "./base";
import { AuditEvent } from "./types";

export class SQLiteAdapter extends BaseAdapter {
  private db: Database.Database;

  constructor(
    private path: string = "./audit.sqlite",
    debug = false,
  ) {
    super(debug);
    this.db = new Database(this.path);
  }

  async init() {
    try {
      this.logger.info(`Connecting to SQLite at ${this.path}...`);
      this.db.pragma("journal_mode = WAL");
      this.db.exec(`
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
      this.logger.success(
        "Connected to SQLite and ensured audit_events table.",
      );
    } catch (err) {
      this.logger.error("Failed to initialize SQLite adapter.");
      console.error(err);
      throw err;
    }
  }

  async logEvent(event: AuditEvent) {
    const stmt = this.db.prepare(`
      INSERT INTO audit_events (actor_id, action, entity, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      event.actorId,
      event.action,
      event.entity,
      event.entityId,
      JSON.stringify(event.metadata || {}),
    );

    this.log("Logged event:", info);
    return info;
  }
}
