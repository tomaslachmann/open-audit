import type { Pool } from "mysql2/promise";
import { CreateMysqlAdapter } from "./utils/createMysqlAdapter";

export class MySQL2Adapter extends CreateMysqlAdapter {
  constructor(pool: Pool, debug = false) {
    super(
      async () => {
        // test connection
        const conn = await pool.getConnection();
        conn.release();
      },
      (sql, values) => pool.query(sql, values),
      debug,
    );
  }
}
