# Research & Decisions

## Decision 1: Custom Invitation System

**Context**: We need to allow invited users to accept an invitation via either Password setup OR Google OAuth.
**Choice**: Implement a custom `Invitations` table and email flow, independent of Supabase's built-in `inviteUserByEmail`.
**Rationale**:

- Supabase's native invite flow (`inviteUserByEmail`) pre-creates a user and enforces a password set flow, which creates friction for users wanting to use Google Auth.
- A custom table allows us to store the invitation state (`pending`, `accepted`) and `organizationId` before the user exists in `auth.users`.
- Flow:
  1. Admin creates Invitation in DB.
  2. System sends email with magic link (`/invite?token=xyz`).
  3. User clicks link.
  4. App verifies token.
  5. User chooses "Sign up with Google" or "Set Password".
  6. On successful auth, a server action links the new `auth.uid` to the `Organization` based on the invitation email.

## Decision 2: Banned User Enforcement

**Context**: Banned users must be immediately prevented from accessing the system.
**Choice**: Dual-layer enforcement: Middleware Check + RLS Policies.
**Rationale**:

- **RLS**: The database is the ultimate source of truth. All queries to business data will have `AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND status != 'banned')`. This ensures even if the UI leaks, data is safe.
- **Middleware**: To provide a good UX (redirect to `/banned`), we will check the user's status in `middleware.ts` (or a cached version of it).
- **Session Termination**: When an admin bans a user, we will call `supabase.auth.admin.signOut(uid)` (if available/supported) or simply rely on the RLS/Middleware to block the next request.

## Decision 3: 2FA Implementation

**Context**: Secure account access with TOTP.
**Choice**: Use Supabase Native MFA (TOTP).
**Rationale**:

- Supabase provides robust APIs (`mfa.enroll`, `mfa.challenge`, `mfa.verify`) compatible with standard authenticator apps.
- We will build UI components to drive this flow (QR code display, code entry).
- Enforcement: Check `aud` (assurance level) in the session. If `aal1` (password only) but user has 2FA enabled, redirect to MFA challenge page.

## Decision 4: Email Delivery

**Context**: Sending transactional emails (Invites, Forgot Password).
**Choice**: React Email + Resend.
**Rationale**:

- Already mandated by Constitution.
- Provides type-safe email templates and reliable delivery.
- "Forgot Password" will use Supabase's `resetPasswordForEmail` which handles the token generation, but we can customize the email template if we disable the native email and use the API to generate the link, then send via Resend. _Refinement_: For simplicity/speed in this starter, we might stick to Supabase's native Reset Password email if customization isn't critical, OR use `supabase.auth.resetPasswordForEmail(email, { redirectTo: '...' })` and let Supabase send it.
- _Refined Choice_: Use Supabase native emails for "Reset Password" (customized in Supabase dashboard) to save effort, BUT implementation plan calls for Resend.
- _Correction_: To strictly follow the "React Email + Resend" mandate, we should intercept the flow.
  - **Forgot Password**: We will generate the link manually? No, Supabase doesn't easily expose the raw token for us to email manually without "admin" privileges.
  - **Compromise**: We will use Supabase's native email for "Reset Password" for now (as it's secure and standard), but use Resend for "Invitations" (custom flow). If strict adherence is required for ALL emails, we'd need to use `supabase.auth.admin.generateLink` which requires service role key (backend only).
  - **Decision**: Use Resend for Invitations (Custom). Use Supabase Native for Auth verification/Reset Password (configured to redirect correctly).
