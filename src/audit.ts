import { PgAdapter } from "./adapters/pg";
import { BaseAdapter } from "./adapters/base";
import { AuditInitConfig } from "./adapters/types";
import { FileAdapter } from "./adapters/file";
import { MySQL2Adapter } from "./adapters/mysql2";
import { BetterSqlite3Adapter } from "./adapters/sqlite";
import { MongoDBAdapter } from "./adapters/mongodb";
import { AuditEvent } from "./adapters/types";

let adapter: BaseAdapter | null = null;

export const OpenAudit = {
  async init(config: AuditInitConfig) {
    switch (config.provider) {
      case "postgresql":
        if (config.driver === "pg") {
          adapter = new PgAdapter(config.pool, config.debug);
        } else {
          adapter = config.adapter;
        }
        break;
      case "mysql":
        if (config.driver === "mysql2") {
          adapter = new MySQL2Adapter(config.pool, config.debug);
        } else {
          adapter = adapter;
        }
        break;
      case "file":
        adapter = new FileAdapter(config.path, config.debug);
        break;
      case "sqlite":
        if (config.driver === "better-sqlite3") {
          adapter = new BetterSqlite3Adapter(config.db, config.debug);
        } else {
          adapter = adapter;
        }
        break;
      case "mongodb":
        if (config.driver === "mongodb") {
          adapter = new MongoDBAdapter(
            config.client,
            config.dbName,
            config.collectionName,
            config.debug,
          );
        } else {
          adapter = adapter;
        }

        break;
      default:
        throw new Error(`[OpenAudit] Unsupported provider`);
    }

    if (adapter !== null) {
      await adapter.init();
    }
  },

  async log(event: AuditEvent) {
    if (adapter === null) {
      throw new Error(`[OpenAudit] Unsupported provider`);
    }
    return await adapter.logEvent(event);
  },
};
