# Tasks: Enhanced Authentication System

**Feature Branch**: `002-auth-enhancement`
**Status**: Pending

## Phase 1: Setup

_Goal: Configure environment and dependencies._

- [ ] T001 Install React Email and Resend packages
- [ ] T002 Configure Resend API key in `.env.local`
- [ ] T003 Configure Supabase Google OAuth in `.env.local` and Supabase Dashboard
- [ ] T004 Create email templates directory `features/org/emails`

## Phase 2: Foundational

_Goal: Database schema and shared validation._

- [ ] T005 [P] Define `profiles` table schema in `shared/lib/db/schema.ts`
- [ ] T006 [P] Define `invitations` table schema in `shared/lib/db/schema.ts`
- [ ] T007 [P] Define `members` table schema in `shared/lib/db/schema.ts` (if not exists)
- [ ] T008 [P] Generate and run Drizzle migrations
- [ ] T009 [P] Create Zod schemas for Auth (Login, Register) in `features/auth/schemas.ts`
- [ ] T010 [P] Create Zod schemas for Invitations in `features/org/schemas.ts`

## Phase 3: Core Authentication (User Story 2)

_Goal: Enable basic Login/Register with Email and Google._
_Independent Test: User can register and login with both Email/Password and Google._

- [ ] T034 [US2] Create E2E auth setup and login tests `tests/e2e/auth.setup.ts` and `tests/e2e/login.spec.ts`
- [ ] T035 [US2] Implement `resetPassword` and `updatePassword` server actions in `features/auth/actions/auth-actions.ts`
- [ ] T011 [P] [US2] Implement `signUp` server action in `features/auth/actions/auth-actions.ts`
- [ ] T012 [P] [US2] Implement `signIn` server action in `features/auth/actions/auth-actions.ts`
- [ ] T013 [P] [US2] Implement `signInWithGoogle` server action in `features/auth/actions/auth-actions.ts`
- [ ] T014 [P] [US2] Implement `signOut` server action in `features/auth/actions/auth-actions.ts`
- [ ] T015 [US2] Create Sign In form component `features/auth/components/sign-in-form.tsx`
- [ ] T016 [US2] Create Sign Up form component `features/auth/components/sign-up-form.tsx`
- [ ] T017 [US2] Create Forgot Password form `features/auth/components/forgot-password-form.tsx`
- [ ] T018 [US2] Implement Auth pages in `app/[locale]/(auth)/login/page.tsx` and `register/page.tsx`
- [ ] T019 [US2] Implement Auth callback route `app/auth/callback/route.ts`

## Phase 4: Invitations (User Story 1)

_Goal: Allow admins to invite users and users to accept via Password or Google._
_Independent Test: Admin sends invite -> Email received -> User accepts -> User added to Org._

- [ ] T036 [US1] Create E2E invite tests `tests/e2e/invite.spec.ts`
- [ ] T020 [US1] Create Invite Email template `features/org/emails/invite-email.tsx`
- [ ] T021 [P] [US1] Implement `createInvitation` action in `features/org/actions/invitation-actions.ts`
- [ ] T022 [P] [US1] Implement `acceptInvitation` action in `features/org/actions/invitation-actions.ts`
- [ ] T023 [US1] Create Invite User Dialog component `features/org/components/invite-user-dialog.tsx`
- [ ] T024 [US1] Implement Invitation Acceptance Page `app/[locale]/(auth)/invite/[token]/page.tsx`
- [ ] T025 [US1] Update `sign-up-form.tsx` to handle `invite_token` prop for linking

## Phase 5: Security (User Story 3)

_Goal: Enforce 2FA and Banning._
_Independent Test: Banned user cannot login. User with 2FA challenged on login._

- [ ] T037 [US3] Create E2E security tests `tests/e2e/security.spec.ts`
- [ ] T026 [P] [US3] Implement `banUser` action in `features/admin/actions/user-actions.ts`
- [ ] T027 [P] [US3] Implement MFA enrollment actions in `features/auth/actions/mfa-actions.ts`
- [ ] T028 [US3] Create MFA Setup component `features/auth/components/mfa-setup.tsx`
- [ ] T029 [US3] Create MFA Verify page `app/[locale]/(auth)/verify/page.tsx`
- [ ] T030 [US3] Update `middleware.ts` to check for Banned status and MFA requirement

## Phase 6: Polish

_Goal: UX refinements._

- [ ] T031 Add toast notifications for all success/error states
- [ ] T032 Add loading states to all forms
- [ ] T033 Verify responsive design on mobile for auth pages

## Dependencies

1. Phase 1 & 2 must be completed first.
2. Phase 3 (Core Auth) is required for Admin Login (prerequisite for Phase 4).
3. Phase 4 (Invitations) depends on Core Auth actions.
4. Phase 5 (Security) wraps around existing Auth flows.

## Parallel Execution

- T005, T006, T007 (Schema definitions) can be done in parallel.
- T011, T012, T013 (Auth Actions) can be done in parallel.
- T021, T022 (Invite Actions) can be done in parallel.

## Implementation Strategy

1. **MVP**: Complete Phase 1, 2, and 3 to get basic system running.
2. **Feature 1**: Complete Phase 4 to unblock team growth.
3. **Feature 2**: Complete Phase 5 for security compliance.
