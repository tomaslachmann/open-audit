import "dotenv/config";
import { OpenAudit } from "@arcari/open-audit";
import { Pool } from "pg";
import { CreatePostgresAdapter } from "../../src/adapters/utils/createPostgresAdapter";

const pool = new Pool({ connectionString: process.env.TEST_PG_URI });
const adapter = new CreatePostgresAdapter(pool.connect, pool.query, true);

await OpenAudit.init({
  provider: "postgresql",
  driver: "custom",
  adapter,
});

await OpenAudit.log({
  action: "custom_event",
  entity: "something",
});

