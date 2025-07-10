import type { AdapterInterface, AuditEvent } from "../types";
import { BaseAdapter } from "../base";

export class CreateMysqlAdapter
  extends BaseAdapter
  implements AdapterInterface
{
  private connect: () => Promise<void>;
  private execute: (sql: string, values: any[]) => Promise<any>;

  constructor(
    connect: () => Promise<void>,
    execute: (sql: string, values: any[]) => Promise<any>,
    debug = false,
  ) {
    super(debug);
    this.connect = connect;
    this.execute = execute;
  }

  async init() {
    this.logger.info("Initializing MySQL adapter...");

    try {
      await this.connect();
      this.logger.success("Connected to MySQL.");

      await this.createTable();
      this.logger.success("audit_events table is ready.");
    } catch (err) {
      this.logger.error("Failed to initialize MySQL adapter.");
      console.error(err);
      throw err;
    }
  }

  private async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS audit_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actor_id VARCHAR(255),
        action VARCHAR(255) NOT NULL,
        entity VARCHAR(255),
        entity_id VARCHAR(255),
        metadata JSON
      );
    `;
    await this.execute(sql, []);
  }

  async logEvent(event: AuditEvent) {
    const sql = `
      INSERT INTO audit_events (actor_id, action, entity, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      event.actorId,
      event.action,
      event.entity,
      event.entityId,
      JSON.stringify(event.metadata || {}),
    ];
    const result = await this.execute(sql, values);
    this.log("Logged event:", result);
    return result;
  }
}
