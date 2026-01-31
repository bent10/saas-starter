# Tasks: Fix Auth Redirects

**Spec**: `specs/004-fix-auth-redirects/spec.md`
**Status**: Pending
**Phase**: 1 - Setup

## Phase 1: Setup & Configuration

**Goal**: Prepare the environment and verify external configurations.

- [x] T001 Verify Google OAuth provider is enabled in Supabase Dashboard (Manual Check).
- [x] T002 Verify `NEXT_PUBLIC_APP_URL` is set in `.env.local` (Manual Check).

## Phase 2: Foundation (Shared Utilities)

**Goal**: Establish locale-aware navigation utilities required for all user stories.

- [x] T003 Create `shared/lib/navigation.ts` exporting `Link`, `redirect`, `usePathname`, `useRouter` from `next-intl/navigation`.

## Phase 3: Core Auth & Redirection (US1, US2, US3)

**Goal**: Ensure login/logout and protected routes redirect to the correct localized paths.
**Independent Test**: Login redirects to `/[locale]/dashboard`, Logout to `/[locale]/login`, Protected route access redirects to `/[locale]/login`.

### Implementation

- [x] T004 [US3] Update `proxy.ts` to detect locale and use it for unauthenticated redirects (e.g., to `/${locale}/login`).
- [x] T005 [US1] Update `signIn` action in `features/auth/actions/auth-actions.ts` to use `getLocale` and redirect to `/${locale}/dashboard`.
- [x] T006 [US2] Update `signOutAction` in `features/auth/actions/auth-actions.ts` to use `getLocale` and redirect to `/${locale}/login`.

### Testing

- [x] T007 [US1] Update `tests/e2e/login.spec.ts` to verify redirection to `/[locale]/dashboard`.
- [x] T008 [US2] Update `tests/e2e/logout.spec.ts` to verify redirection to `/[locale]/login`.
- [x] T009 [US3] Update `tests/e2e/security.spec.ts` to verify unauthenticated access redirects to `/[locale]/login`.

## Phase 4: Google OAuth (US4)

**Goal**: Fix Google OAuth "unsupported provider" error and ensure localized callback redirection.
**Independent Test**: "Continue with Google" successfully logs in and redirects to `/[locale]/dashboard`.

### Implementation

- [x] T010 [US4] Update `signInWithGoogle` in `features/auth/actions/auth-actions.ts` to use correct `redirectTo` URL.
- [x] T011 [US4] Update `app/auth/callback/route.ts` to handle session exchange and redirect to `/${locale}/dashboard`.

## Phase 5: Navigation Links (US5)

**Goal**: Ensure links between Login and Register pages preserve the current locale.
**Independent Test**: Clicking "Sign up" on `/id/login` goes to `/id/register`.

### Implementation

- [x] T012 [P] [US5] Update `features/auth/components/sign-in-form.tsx` to use `Link` from `shared/lib/navigation.ts`.
- [x] T013 [P] [US5] Update `features/auth/components/sign-up-form.tsx` to use `Link` from `shared/lib/navigation.ts`.

## Phase 6: Polish & Verification

**Goal**: Final manual verification and code cleanup.

- [x] T014 Run full E2E test suite `npm run test:e2e`.
- [x] T015 Perform manual verification using `specs/004-fix-auth-redirects/quickstart.md`.

## Dependencies

1.  **US3 (Middleware)** depends on **T003 (Navigation Lib)** - _actually Middleware usually uses `next-intl/middleware`, not the navigation lib, but the foundation phase is good practice._
2.  **US1 & US2 (Actions)** depend on **T003** (if they use `redirect` from it, or standard next `redirect` with manual locale). The plan decided to use standard `next-intl` navigation wrapper.
3.  **US5** depends on **T003**.

## Implementation Strategy

Start with **T003** to set up the router utilities. Then tackle the Middleware (**T004**) as it affects all routes. Then fix the Server Actions (**T005, T006**) and their tests. Finally, handle the OAuth specific flow (**US4**) and UI links (**US5**).
