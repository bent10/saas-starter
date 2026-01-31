# Quickstart: User Logout

## Verification

### Manual Testing

1.  **Login**:
    - Navigate to `/login`.
    - Sign in with valid credentials.
    - Ensure you are redirected to the dashboard.

2.  **Perform Logout**:
    - Locate the user profile menu (usually in the sidebar or top nav).
    - Click "Logout".

3.  **Verify Outcome**:
    - **Redirect**: You should be immediately redirected to `/login` (or the landing page).
    - **Session Cleared**: Try to manually navigate back to `/dashboard`. You should be redirected back to `/login`.
    - **Cookies**: (Optional) Inspect browser cookies; the Supabase auth token should be removed or invalidated.

### Automated Testing

Run the E2E tests:

```bash
npx playwright test tests/e2e/logout.spec.ts
```
