# Feature Specification: Enhanced Authentication System

**Feature Branch**: `002-auth-enhancement`
**Created**: 2026-01-30
**Status**: Draft
**Input**: User description: "Saya akan fokus pada peningkatan fitur Authentication. Ruang lingkup fitur: - Login - Register - Forgot password - Reset password - Two-factor authentication - Banned user - Invitation - Login/Register menggunakan Google Bug yang ditemukan saat ini: - Tidak ada feedback yang jelas saat proses invitation. - User yang di-invite tidak menerima email untuk proses autentikasi. - URL [locale]/(auth)/invite/[token] berhasil diakses tetapi tidak menjalankan proses apa pun; seharusnya mengarahkan user untuk mengatur/mengisi password."

## Clarifications

### Session 2026-01-30

- Q: Which fields should be included in the User Profile? -> A: **Extended**: `full_name`, `username` (unique), `avatar_url`, and `bio`.
- Q: How should invited users be allowed to accept invitations? -> A: **Flexible**: Users can set a password OR sign up with Google (if emails match).
- Q: How should the "Banned user" mechanism handle active sessions? -> A: **Immediate**: Invalidate all active sessions immediately; access is denied instantly.
- Q: How long should an invitation token remain valid? -> A: 7 days.
- Q: How should 2FA recovery be handled if a device is lost? -> A: **Self-Service**: Users can use single-use recovery codes generated during 2FA setup.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Invitation & Onboarding Fixes (Priority: P1)

As an Organization Admin, I want to invite new members and ensure they can successfully join, so that my team can collaborate.
As an Invited User, I want to receive an email and set up my password, so that I can access the system securely.

**Why this priority**: Critical bug fixes. Currently, invitations are broken (no email, no feedback, broken link flow), blocking user growth.

**Independent Test**: Can be fully tested by simulating an admin invite and verifying the email delivery, link click, and successful password setup/login for the new user.

**Acceptance Scenarios**:

1. **Given** an Admin on the dashboard, **When** they invite a user by email, **Then** the system provides clear success feedback and sends an invitation email.
2. **Given** an Invited User receives an email, **When** they click the link, **Then** they are redirected to a password setup page (not a dead end).
3. **Given** an Invited User on the password setup page, **When** they submit a valid password, **Then** their account is confirmed and they are logged in.

---

### User Story 2 - Core Authentication (Priority: P1)

As a User, I want to sign up and log in using Email/Password or Google, so that I can access my account.

**Why this priority**: Fundamental access requirement.

**Independent Test**: Can be tested by registering/logging in with both methods (Email, Google) and verifying session creation.

**Acceptance Scenarios**:

1. **Given** a visitor, **When** they sign up with Google, **Then** an account is created and they are logged in.
2. **Given** a visitor, **When** they sign up with Email/Password, **Then** an account is created and they are logged in (possibly after email verification if configured).
3. **Given** a registered user, **When** they request a password reset, **Then** they receive an email with a link to set a new password.

---

### User Story 3 - Enhanced Security (2FA & Bans) (Priority: P2)

As a User, I want to secure my account with 2FA.
As an Admin, I want to ban abusive users to protect the platform.

**Why this priority**: Adds necessary security layers but depends on core auth being functional.

**Independent Test**: Can be tested by enabling 2FA and verifying the login challenge, and by banning a user and verifying login denial.

**Acceptance Scenarios**:

1. **Given** a user with 2FA enabled, **When** they log in with correct credentials, **Then** they are challenged for a TOTP code before access is granted.
2. **Given** a banned user, **When** they attempt to log in, **Then** access is denied with a clear "Account Suspended" message.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST support user registration and login via Email/Password.
- **FR-002**: System MUST support user registration and login via Google OAuth.
- **FR-003**: System MUST provide a "Forgot Password" flow that sends a reset link via email.
- **FR-004**: System MUST allow users to reset their password via a valid token from the reset link.
- **FR-005**: System MUST allow users to enable 2FA (TOTP) and generate a set of recovery codes.
- **FR-006**: System MUST enforce 2FA verification during login for users who have enabled it.
- **FR-007**: System MUST allow Admins to invite users via email to an organization.
- **FR-008**: System MUST send an email notification to invited users with a unique link.
- **FR-009**: The invitation link MUST direct the user to a page where they can accept the invitation by either setting a password OR signing up with Google (if the email matches).
- **FR-010**: System MUST support a "Banned" status for users.
- **FR-011**: System MUST prevent login for users with "Banned" status.
- **FR-012**: System MUST provide visual feedback (toast/notification) to the Admin upon successful or failed invitation sending.

### Key Entities _(include if feature involves data)_

- **User**: Represents a registered account. Attributes: email, password_hash, auth_provider (email/google), 2fa_secret, is_banned.
- **Invitation**: Represents a pending invite. Attributes: email, token, org_id, expires_at, status (pending/accepted).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Invited users successfully receive emails 100% of the time (barring invalid emails).
- **SC-002**: 100% of valid invitation links redirect to the password setup page.
- **SC-003**: Users can complete the "Forgot Password" flow in under 2 minutes.
- **SC-004**: Banned users are strictly prevented from accessing authenticated routes.
- **SC-005**: Users can successfully enable 2FA and login using a TOTP app (e.g., Google Authenticator).
