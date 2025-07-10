import type { Pool } from "pg";
import type { Pool as MysqlPool } from "mysql2/promise";
import type { Database } from "better-sqlite3";
import type { MongoClient } from "mongodb";
import { BaseAdapter } from "./base";
import { CreateSqliteAdapter } from "./utils/createSqliteAdapter";
import { CreatePostgresAdapter } from "./utils/createPostgresAdapter";
import { CreateMysqlAdapter } from "./utils/createMysqlAdapter";
import { CreateMongoAdapter } from "./utils/createMongoAdapter";

export type Provider = "postgresql" | "file" | "mysql" | "sqlite" | "mongodb";

export type Driver = "pg" | "mysql2" | "better-sqlite3" | "mongodb" | "custom";

type BaseConfig = {
  debug?: boolean;
  driver: Driver;
};

export interface AdapterInterface {
  init(): Promise<void>;
}

type CustomPostgresProvider = {
  provider: "postgresql";
  adapter: CreatePostgresAdapter;
  driver: "custom";
};

type CustomMysqlProvider = {
  provider: "mysql";
  adapter: CreateMysqlAdapter;
  driver: "custom";
};

type CustomMongoProvider = {
  provider: "mongodb";
  adapter: CreateMongoAdapter;
  driver: "custom";
};

type CustomSqliteProvider = {
  provider: "sqlite";
  adapter: CreateSqliteAdapter;
  driver: "custom";
};

type PgProvider = {
  provider: "postgresql";
  pool: Pool;
  driver: "pg";
} & BaseConfig;

type MysqlProvider = {
  provider: "mysql";
  pool: MysqlPool;
  driver: "mysql2";
} & BaseConfig;

type FileProvider = {
  provider: "file";
  path?: string;
} & BaseConfig;

type SqliteProvider = {
  provider: "sqlite";
  db: Database;
  driver: "better-sqlite3";
} & BaseConfig;

type MongodbProvider = {
  provider: "mongodb";
  driver: "mongodb";
  client: MongoClient;
  collectionName?: string;
  dbName?: string;
} & BaseConfig;

export type AuditInitConfig =
  | PgProvider
  | MysqlProvider
  | FileProvider
  | SqliteProvider
  | MongodbProvider
  | CustomPostgresProvider
  | CustomMysqlProvider
  | CustomSqliteProvider
  | CustomMongoProvider;

export type AuditEvent = {
  actorId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: object;
};
