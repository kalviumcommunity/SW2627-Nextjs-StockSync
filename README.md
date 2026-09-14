# SW2627-Nextjs-StockSync

## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. Replace the placeholder `DATABASE_URL` with the Supabase PostgreSQL connection pooler URL and set a strong `JWT_SECRET`.
3. Apply the Prisma schema and seed the database:

```bash
npm install
npm run prisma:push
npm run seed
npm run dev
```

Inventory changes are written through Prisma transactions directly to Supabase. The stock update endpoint returns an error when `DATABASE_URL` is missing or the database write fails; it does not report an in-memory update as persisted.
