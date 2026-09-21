# SW2627-Nextjs-StockSync

## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. In Supabase, open **Connect**, select **Transaction pooler**, and copy its URI. Use that complete URI for `DATABASE_URL`; it must use port `6543`, not the direct database host on port `5432`.
3. Set a strong `JWT_SECRET`.
4. Create a Resend account, verify the sending domain, and set `RESEND_API_KEY`, `EMAIL_FROM`, and `APP_URL`.
5. Apply the Prisma schema and seed the database:

```bash
npm install
npm run prisma:push
npm run seed
npm run dev
```

Inventory changes are written through Prisma transactions directly to Supabase. The stock update endpoint returns an error when `DATABASE_URL` is missing or the database write fails; it does not report an in-memory update as persisted.

New accounts must click the verification link sent by Resend before they can log in. Set the same email variables in Render; `EMAIL_FROM` must use a domain verified in Resend.

### Render deployment

In the Render service, add or replace the `DATABASE_URL` environment variable with the Supabase **Transaction pooler** URI from **Supabase Dashboard > Connect**. Do not use `db.<project-ref>.supabase.co:5432`, because Render may not have IPv6 access to Supabase's direct database endpoint. Save the variable and redeploy the service.

The URI should have this shape:

```text
postgresql://postgres.<project-ref>:<password>@<pooler-host>:6543/postgres?pgbouncer=true&connection_limit=1
```
