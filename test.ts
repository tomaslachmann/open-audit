import { OpenAudit } from "./src/index";

async function runTest() {
  await OpenAudit.init({
    provider: "postgresql",
    url: "postgresql://postgres:postgres@localhost:5432/openaudit",
    debug: true,
  });

  const result = await OpenAudit.log({
    actorId: "user-123",
    action: "user.login",
    entity: "user",
    entityId: "123",
    metadata: { ip: "127.0.0.1" },
  });

  console.log("Audit Event Saved:", result);
}

runTest().catch(console.error);
