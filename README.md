# SaaS Starter

Production-ready foundation for building modern SaaS applications.

## Features Implemented

- **Authentication**: Email/Password Sign-up, Sign-in, Sign-out via Supabase Auth.
- **Multi-Tenancy**: Organization creation, Member invitation, Role management (Owner/Member).
- **Billing**: Stripe Subscription integration (Checkout, Portal, Webhooks).
- **UI/UX**: Dashboard layout, Sidebar, Dark Mode, Mobile responsiveness.
- **Tech Stack**: Next.js 16 (App Router), Tailwind v4, Drizzle ORM, Supabase, Stripe, Shadcn UI.

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase Project
- Stripe Account

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for admin tasks)
SUPABASE_GOOGLE_CLIENT_ID=
SUPABASE_GOOGLE_CLIENT_SECRET=

DATABASE_URL=postgres://postgres:[password]@db.[ref].supabase.co:5432/postgres

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...

RESEND_API_KEY=re_... (optional for now, used by Auth)
```

### Installation

```bash
npm install
```

### Database Setup

1. Push schema to Supabase:
   ```bash
   npm run db:push
   ```
2. Enable RLS policies (SQL provided in `shared/lib/db/rls.sql`).

### Running Development Server

```bash
npm run dev
```

## Testing

Run E2E tests with Playwright:

```bash
npx playwright test
```
