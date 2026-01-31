# Feature Specification: Fix Auth Redirects

**Feature Branch**: `004-fix-auth-redirects`
**Created**: 2026-01-31
**Status**: Draft
**Input**: User description: "Fix the following issues: - After login, users should be redirected to `/[locale]/dashboard` instead of `/dashboard`. - After logout, users should be redirected to `/[locale]/login` instead of `/login` (disable browser back navigation if necessary). - Unauthenticated users attempting to access auth-required pages must be redirected to the login page. - Fix incorrect login and register links on their respective pages. - Login and register via Google currently return the error: `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}` Current authorization URL: `https://db.humambatik.com/auth/v1/authorize?provider=google&redirect_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&code_challenge=fpvFBOpHiTtkRlNlV0yS7xi7-qtrPLC3qcHR8CtW9pI&code_challenge_method=s256`"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Successful Login Redirection (Priority: P1)

Authenticated users must be redirected to the correct dashboard location, respecting their current locale, immediately after logging in.

**Why this priority**: Essential for basic user navigation and access to the application.

**Independent Test**: Can be tested by logging in with valid credentials and verifying the final URL.

**Acceptance Scenarios**:

1. **Given** a user is on the login page `/[locale]/login`, **When** they successfully log in, **Then** they are redirected to `/[locale]/dashboard`.
2. **Given** a user is on the login page `/id/login`, **When** they successfully log in, **Then** they are redirected to `/id/dashboard`.

---

### User Story 2 - Secure Logout Redirection (Priority: P1)

Users logging out must be redirected to the login page of their current locale, and should not be able to view protected content by using the browser's back button.

**Why this priority**: Critical for security and user session management.

**Independent Test**: Can be tested by clicking the logout button and checking the URL, then attempting to navigate back.

**Acceptance Scenarios**:

1. **Given** an authenticated user is on `/[locale]/dashboard`, **When** they click logout, **Then** they are redirected to `/[locale]/login`.
2. **Given** a user has just logged out, **When** they click the browser's back button, **Then** they are either redirected back to the login page or shown a generic authorized/login page, not the protected dashboard content.

---

### User Story 3 - Unauthenticated Access Protection (Priority: P1)

Unauthenticated users attempting to access protected routes must be intercepted and redirected to the login page.

**Why this priority**: Core security requirement to prevent unauthorized access.

**Independent Test**: Can be tested by opening a private browser window and navigating directly to `/dashboard`.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they navigate to `/dashboard` or `/[locale]/dashboard`, **Then** they are redirected to `/[locale]/login`.
2. **Given** an unauthenticated user, **When** they navigate to `/id/dashboard`, **Then** they are redirected to `/id/login`.

---

### User Story 4 - Google OAuth Login (Priority: P1)

Users must be able to log in and register using their Google account without encountering provider errors.

**Why this priority**: Provides a frictionless onboarding and login experience.

**Independent Test**: Can be tested by clicking "Continue with Google" and completing the flow.

**Acceptance Scenarios**:

1. **Given** a user on the login/register page, **When** they click "Continue with Google", **Then** they are redirected to Google's auth page.
2. **Given** a user completes Google authentication, **When** they are redirected back to the app, **Then** the login is successful and they land on `/[locale]/dashboard`.

---

### User Story 5 - Correct Navigation Links (Priority: P2)

Users on the Login page must see a working link to the Register page, and vice-versa, with correct localization.

**Why this priority**: Ensures users can switch between authentication modes easily.

**Independent Test**: Can be tested by clicking the "Register" link on the login page.

**Acceptance Scenarios**:

1. **Given** a user on `/[locale]/login`, **When** they click the "Sign up" (or equivalent) link, **Then** they navigate to `/[locale]/register`.
2. **Given** a user on `/id/register`, **When** they click the "Sign in" (or equivalent) link, **Then** they navigate to `/id/login`.

---

### Edge Cases

- What happens if the user's session expires while they are on the dashboard? (Should redirect to login upon next interaction/refresh).
- What happens if the locale in the URL is invalid? (Should fallback to default locale or handle 404).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST redirect users to `/[locale]/dashboard` upon successful authentication via email/password.
- **FR-002**: System MUST redirect users to `/[locale]/dashboard` upon successful authentication via Google OAuth.
- **FR-003**: System MUST redirect users to `/[locale]/login` upon logout.
- **FR-004**: System MUST prevent access to protected routes (e.g., `/dashboard`, `/account`) for unauthenticated users by redirecting them to `/[locale]/login`.
- **FR-005**: System MUST ensure navigation links between Login and Register pages preserve the current locale.
- **FR-006**: System MUST be configured to allow Google OAuth provider (resolving "Unsupported provider" error).
- **FR-007**: System MUST handle the OAuth callback correctly and redirect to the dashboard.

### Key Entities

- **User Session**: Represents the authenticated state of a user.
- **Route Middleware**: Logic handling the interception and redirection of requests based on auth state.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of successful logins redirect to the localized dashboard URL.
- **SC-002**: 100% of logout actions redirect to the localized login URL.
- **SC-003**: 0% of unauthenticated requests to `/dashboard/*` are served protected content.
- **SC-004**: Google OAuth flow completes successfully and logs the user in.
- **SC-005**: Navigation between auth pages (Login <-> Register) preserves the active locale.
