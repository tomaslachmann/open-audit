# OpenAudit Example Usage

This folder contains example usage of the `@arcari/open-audit` library using all supported adapters.

## 📦 Installation

```bash
cd example
npm install
```

## ⚙️ Configuration

Ensure you have a `.env` file in the `example/` folder with the following content:

```env
TEST_PG_URI=postgres://postgres:postgres@localhost:5432/audit_test
TEST_MYSQL_URI=mysql://root:password@localhost:3306/audit_test
TEST_MONGO_URI=mongodb://localhost:27017/audit_test
```

> Make sure Docker containers for PostgreSQL, MySQL, and MongoDB are running if you're using those adapters.

## 🚀 Run Examples

Each script uses Node's native TypeScript support via `ts-node`.

```bash
# PostgreSQL
npm run pg

# MySQL
npm run mysql

# SQLite
npm run sqlite

# MongoDB
npm run mongo

# File adapter
npm run file

# Custom PostgreSQL Adapter
npm run custom-pg
```

## 🧪 Notes

- All examples use `await OpenAudit.init(...)` followed by a sample `logEvent`.
- Logs from the File Adapter will appear in `example/logs/`.
