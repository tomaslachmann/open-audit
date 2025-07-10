import { OpenAudit } from "@arcari/open-audit";

await OpenAudit.init({
  provider: "file",
  path: "./logs/audit.log",
  debug: true,
});

await OpenAudit.log({
  action: "login",
  entity: "user",
});

