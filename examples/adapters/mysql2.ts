import "dotenv/config";
import { OpenAudit } from "@arcari/open-audit";
import mysql from "mysql2/promise";

const pool = mysql.createPool({ uri: process.env.TEST_MYSQL_URI });

await OpenAudit.init({
  provider: "mysql",
  driver: "mysql2",
  pool,
  debug: true,
});

await OpenAudit.log({
  action: "create",
  entity: "product",
});

