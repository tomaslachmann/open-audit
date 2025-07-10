import type { Database } from "better-sqlite3";
import { CreateSqliteAdapter } from "./utils/createSqliteAdapter";

export class BetterSqlite3Adapter extends CreateSqliteAdapter {
  constructor(
    private db: Database,
    debug = false,
  ) {
    super(
      async () => {
        // connect is basically noop for better-sqlite3 since it's sync,
        // but we'll set PRAGMA here to enable WAL mode:
        db.pragma("journal_mode = WAL");
      },
      async (sql: string, params?: any[]) => {
        if (sql.trim().toUpperCase().startsWith("INSERT")) {
          const stmt = db.prepare(sql);
          return stmt.run(params);
        } else {
          // For other statements like CREATE TABLE
          return db.exec(sql);
        }
      },
      debug,
    );
  }
}
