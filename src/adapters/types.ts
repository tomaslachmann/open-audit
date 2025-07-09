export type Provider = "postgresql";

export type AuditInitConfig = {
  provider: Provider;
  url: string;
  debug?: boolean;
};

export type AuditEvent = {
  actorId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: object;
};
