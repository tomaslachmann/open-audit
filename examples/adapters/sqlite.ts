import { OpenAudit } from "@arcari/open-audit";
import Database from "better-sqlite3";

const db = new Database(":memory:");

await OpenAudit.init({
  provider: "sqlite",
  driver: "better-sqlite3",
  db,
});

await OpenAudit.log({
  action: "read",
  entity: "config",
});

