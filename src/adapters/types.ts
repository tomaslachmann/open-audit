export type Provider = "postgresql" | "file" | "mysql" | "sqlite" | "mongodb";

export type AuditInitConfig =
  | { provider: "postgresql" | "mysql"; url: string; debug?: boolean }
  | { provider: "file" | "sqlite"; path?: string; debug?: boolean }
  | {
      provider: "mongodb";
      url: string;
      dbName?: string;
      collectionName?: string;
      debug?: boolean;
    };

export type AuditEvent = {
  actorId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: object;
};
