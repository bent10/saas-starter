# Quickstart: Fix Auth Redirects

## Prerequisites

1.  **Supabase Config**: Ensure "Google" provider is enabled in Supabase Dashboard.
2.  **Environment**: `NEXT_PUBLIC_APP_URL` must be set (e.g., `http://localhost:3000`).
3.  **Locales**: Ensure `id` (Indonesian) is added to `i18n.ts` and `messages/id.json` exists for full testing.

## Test Steps

### 1. Verify Login Redirect

- Navigate to `/en/login`.
- Login with valid credentials.
- **Expected**: Redirect to `/en/dashboard`.

### 2. Verify Logout Redirect

- From `/en/dashboard`, click "Log out".
- **Expected**: Redirect to `/en/login`.

### 3. Verify Route Protection

- Open Incognito window.
- Attempt to access `/en/dashboard`.
- **Expected**: Redirect to `/en/login`.

### 4. Verify Locale Persistence (Indonesian)

- Navigate to `/id/login`.
- Check the "Sign up" link URL.
- **Expected**: Link points to `/id/register`.
- Login.
- **Expected**: Redirect to `/id/dashboard`.
