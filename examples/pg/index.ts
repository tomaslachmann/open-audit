import { OpenAudit } from 'open-audit'

async function main() {
  const pgUrl = process.env.PG_URL || 'postgresql://postgres:password@localhost:5432/auditdb'

  await OpenAudit.init({
    provider: 'postgresql',
    url: pgUrl,
    debug: true,
  })

  await OpenAudit.log({
    actorId: 'user_123',
    action: 'login',
    entity: 'user',
    entityId: 'user_123',
    metadata: { ip: '127.0.0.1' },
  })

  console.log('Event logged successfully!')
}

main().catch((err) => {
  console.error('Error running pg example app:', err)
  process.exit(1)
})

