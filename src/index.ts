import { PostgresAdapter } from "./adapters/postgres";
import { BaseAdapter } from "./adapters/base";
import { AuditInitConfig, AuditEvent } from "./adapters/types";
import { FileAdapter } from "./adapters/file";
import { MySQLAdapter } from "./adapters/mysql";
import { SQLiteAdapter } from "./adapters/sqlite";
import { MongoDBAdapter } from "./adapters/mongodb";

let adapter: BaseAdapter | null = null;

export const OpenAudit = {
  async init(config: AuditInitConfig) {
    switch (config.provider) {
      case "postgresql":
        adapter = new PostgresAdapter(config.url, config.debug);
        break;
      case "mysql":
        adapter = new MySQLAdapter(config.url, config.debug);
        break;
      case "file":
        adapter = new FileAdapter(config.path, config.debug);
        break;
      case "sqlite":
        adapter = new SQLiteAdapter(config.path, config.debug);
        break;
      case "mongodb":
        adapter = new MongoDBAdapter(
          config.url,
          config.dbName,
          config.collectionName,
          config.debug,
        );
        break;
      default:
        throw new Error(`[OpenAudit] Unsupported provider`);
    }

    if (adapter !== null) {
      await adapter.init();
    }
  },

  async log(event: AuditEvent) {
    if (!adapter) {
      throw new Error(
        "[OpenAudit] Not initialized. Call OpenAudit.init(...) first.",
      );
    }
    return await adapter.logEvent(event);
  },
};
