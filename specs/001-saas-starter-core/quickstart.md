# Quickstart Guide

## Prerequisites

- Node.js 18+
- Docker (optional, for local Supabase)
- Supabase CLI (if using local instance)
- Stripe CLI (for webhook forwarding)

## Setup Steps

1.  **Clone & Install**

    ```bash
    git clone <repo_url>
    cd saas-starter
    npm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env.local` and fill in the required values:

    ```bash
    cp .env.example .env.local
    ```

    Required keys:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `DATABASE_URL` (Transaction mode)
    - `DIRECT_URL` (Session mode for migrations)
    - `STRIPE_SECRET_KEY`
    - `STRIPE_WEBHOOK_SECRET`

3.  **Database Setup (Supabase)**
    - Create a new Supabase project.
    - Run migrations to setup tables:
      ```bash
      npm run db:push
      ```
    - (Optional) Seed data:
      ```bash
      npm run db:seed
      ```

4.  **Run Development Server**

    ```bash
    npm run dev
    ```

    Access the app at `http://localhost:3000`.

5.  **Run Tests**
    ```bash
    npm run test:e2e
    ```

## Folder Structure Overview

- `app/`: Next.js App Router pages.
- `features/`: Business logic (Auth, Org, Billing).
- `shared/`: Reusable UI components and utilities.
