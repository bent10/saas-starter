# Quickstart: Enhanced Authentication

## Prerequisites

- **Supabase Project**: Ensure you have a Supabase project set up.
- **Resend Account**: Get an API Key.
- **Environment Variables**:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  SUPABASE_SERVICE_ROLE_KEY=...
  RESEND_API_KEY=...
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```

## Setup Steps

1.  **Database Migration**:
    Run the Drizzle migration to create `profiles`, `invitations`, and `members` tables.

    ```bash
    npm run db:generate
    npm run db:migrate
    ```

2.  **Google OAuth Setup**:
    - Go to Supabase Dashboard -> Authentication -> Providers.
    - Enable Google.
    - Add Client ID and Secret (from Google Cloud Console).
    - Add Redirect URL: `[SUPABASE_URL]/auth/v1/callback`.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Testing the Flow

1.  **Register**: Go to `/register` and sign up. Check Supabase `auth.users` and `profiles` table.
2.  **Invite**:
    - Login as the user.
    - Create an Organization (if not exists).
    - Go to `/dashboard/[slug]/members`.
    - Invite `test+invite@example.com`.
3.  **Accept Invite**:
    - Check the simulated email (or Resend logs).
    - Click the link.
    - Choose "Set Password".
    - Verify you are added to the organization.
