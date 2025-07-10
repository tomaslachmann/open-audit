# 🕵️‍♂️ OpenAudit

> A lightweight, pluggable audit log library for Node.js — log user actions to Postgres, MySQL, MongoDB, SQLite, or files.

---

## 🚀 Features

- ✅ Simple API: `OpenAudit.init()` and `OpenAudit.log()`
- ✅ Multiple storage adapters:
  - PostgreSQL (`pg`)
  - MySQL / MariaDB (`mysql2`)
  - SQLite (`better-sqlite3`)
  - MongoDB (`mongodb`)
  - File-based (JSON files)
- ✅ Automatic table/collection creation on init
- ✅ Debug/logging support with color output
- ✅ Lightweight — no ORM, no runtime bloat

---

## 📦 Install

```bash
npm install @arcari/open-audit
```

> You'll also need to install the database driver for your chosen adapter, or pass your custom, check the examples:

```bash
# For PostgreSQL
npm install pg

# For MySQL/MariaDB
npm install mysql2

# For MongoDB
npm install mongodb

# For SQLite
npm install better-sqlite3
```

---

## 🛠️ Basic Usage

```ts
import { OpenAudit } from "open-audit";

await OpenAudit.init({
  provider: "postgresql", // 'mysql' | 'mongodb' | 'sqlite' | 'file'
  url: "postgres://user:pass@localhost:5432/mydb",
  debug: true,
  driver: "pg",
});

await OpenAudit.log({
  actorId: "user_123",
  action: "user.login",
  entity: "user",
  entityId: "user_123",
  metadata: {
    ip: "127.0.0.1",
    userAgent: "Mozilla/5.0",
  },
});
```

---

## 📁 Examples

Explore the [`examples`](./examples) folder in this repository to find practical usage examples demonstrating:

- How to initialize and configure the library
- Usage of all supported adapters (PostgreSQL, MySQL, SQLite, MongoDB, File, and custom)
- Sample configurations and connection setups
- Logging and audit event recording in action

These examples serve as a hands-on guide to quickly get started with the library in your projects.

---

## ⚙️ Configuration per Adapter

### 🔹 PostgreSQL and pg driver

```ts
{
  provider: 'postgresql',
  url: 'postgres://user:pass@host:port/db',
  debug?: boolean,
  driver: "pg"
}
```

---

### 🔹 MySQL / MariaDB and mysql2 driver

```ts
{
  provider: 'mysql',
  url: 'mysql://user:pass@host:port/db',
  debug?: boolean,
  driver: "mysql2"
}
```

---

### 🔹 MongoDB and mongo driver

```ts
{
  provider: 'mongodb',
  url: 'mongodb://localhost:27017',
  dbName?: string,          // default: 'audit'
  collectionName?: string,  // default: 'audit_events'
  debug?: boolean,
  driver: "mongo"
}
```

---

### 🔹 SQLite and better-sqlite3 driver

```ts
{
  provider: 'sqlite',
  path?: string,   // default: './audit.sqlite'
  debug?: boolean,
  driver: "better-sqlite3"
}
```

---

### 🔹 File (JSON-based logging)

```ts
{
  provider: 'file',
  path?: string,   // default: './audit_logs'
  debug?: boolean
}
```

Each log is written to a daily `.json` file:

```
audit_logs/
  └── 2025-07-09.json
```

---

## 🧪 Event Format

```ts
type AuditEvent = {
  actorId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: object;
};
```

Example:

```ts
await OpenAudit.log({
  actorId: "user_1",
  action: "post.create",
  entity: "post",
  entityId: "post_123",
  metadata: {
    title: "Hello World",
    tags: ["intro", "welcome"],
  },
});
```

---

## 🧱 Example SQL Schema (Postgres/MySQL)

```sql
CREATE TABLE audit_events (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT now(),
  actor_id TEXT,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  metadata JSONB
);
```

SQLite stores `metadata` as a stringified JSON column.

---

## 📣 Roadmap / Coming Soon

- [ ] Web dashboard to view audit logs
- [ ] CLI for searching and exporting logs
- [ ] Custom adapter support (plugin interface)
- [ ] Type-safe schema validation
- [ ] Option for per-tenant database separation

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

To get started locally:

```bash
git clone https://github.com/yourname/open-audit.git

cd open-audit

npm install

npm run dev
```

---

## 📄 License

MIT — Tomas Lachmann  
Built in 🇨🇿 Czechia with ❤️
