import type { Pool } from "pg";
import { CreatePostgresAdapter } from "./utils/createPostgresAdapter";

export class PgAdapter extends CreatePostgresAdapter {
  constructor(pool: Pool, debug = false) {
    super(
      async () => {
        const client = await pool.connect();
        client.release();
      },
      (sql, values) => pool.query(sql, values),
      debug,
    );
  }
}
