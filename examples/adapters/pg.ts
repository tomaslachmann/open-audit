import "dotenv/config";
import { OpenAudit } from "@arcari/open-audit";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.TEST_PG_URI });

await OpenAudit.init({
  provider: "postgresql",
  driver: "pg",
  pool,
  debug: true,
});

await OpenAudit.log({
  action: "create",
  entity: "user",
});

