import { PostgresAdapter } from "./adapters/postgres";
import { BaseAdapter } from "./adapters/base";
import { AuditEvent, AuditInitConfig } from "./adapters/types";

let adapter: BaseAdapter | null = null;

export const OpenAudit = {
  async init(config: AuditInitConfig) {
    switch (config.provider) {
      case "postgresql":
        adapter = new PostgresAdapter(config.url, config.debug);
        await adapter.init();
        break;
      default:
        throw new Error(`[OpenAudit] Unsupported provider: ${config.provider}`);
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
