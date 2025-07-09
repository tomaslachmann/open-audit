import type { Pool } from "pg";
import type { Pool as MysqlPool } from "mysql2/promise";
import type { Database } from "better-sqlite3";
import type { MongoClient } from "mongodb";

export type Provider = "postgresql" | "file" | "mysql" | "sqlite" | "mongodb";

type BaseConfig = {
  debug?: boolean;
};

type PgProvider = {
  provider: "postgresql";
  pool: Pool;
} & BaseConfig;

type MysqlProvider = {
  provider: "mysql";
  pool: MysqlPool;
} & BaseConfig;

type FileProvider = {
  provider: "file";
  path?: string;
} & BaseConfig;

type SqliteProvider = {
  provider: "sqlite";
  db: Database;
} & BaseConfig;

type MongodbProvider = {
  provider: "mongodb";
  client: MongoClient;
  collectionName?: string;
  dbName?: string;
} & BaseConfig;

export type AuditInitConfig =
  | PgProvider
  | MysqlProvider
  | FileProvider
  | SqliteProvider
  | MongodbProvider;

export type AuditEvent = {
  actorId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: object;
};
