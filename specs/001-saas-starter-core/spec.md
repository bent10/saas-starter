# Feature Specification: SaaS Starter Core

**Feature Branch**: `001-saas-starter-core`  
**Created**: 2026-01-29  
**Status**: Draft  
**Input**: User description: "Membangun SaaS Starter Template, sebuah fondasi siap produksi yang skalabel untuk membangun aplikasi SaaS modern. Template ini menyediakan fitur-fitur esensial seperti autentikasi, multi-tenancy, billing, serta sistem UI yang solid, sehingga tim dapat fokus pada diferensiasi produk alih-alih membangun infrastruktur dari nol. Lihat @README.md untuk informasi lebih detail."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication & Onboarding (Priority: P1)

As a new user, I want to sign up using my email or social account so that I can access the application securely.

**Why this priority**: Authentication is the gatekeeper for all other features. Without it, there is no user identity or security.

**Independent Test**: Can be fully tested by registering a new account, verifying email, and logging in.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they choose "Sign Up", **Then** they can register via Email/Password or Social Provider (Google).
2. **Given** a registered user, **When** they log in with correct credentials, **Then** they are redirected to the dashboard.
3. **Given** a user with a lost password, **When** they request a reset, **Then** they receive a recovery email and can set a new password.
4. **Given** an authenticated user, **When** they enable MFA, **Then** subsequent logins require a TOTP code.

---

### User Story 2 - Organization Management (Multi-Tenancy) (Priority: P1)

As a user, I want to create and manage organizations so that I can collaborate with my team in an isolated environment.

**Why this priority**: Multi-tenancy is the core architecture of this SaaS starter, enabling data isolation and team collaboration.

**Independent Test**: Can be tested by creating an organization, inviting a second user, and verifying the second user can access shared resources.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they create a new organization, **Then** they are assigned as the "Owner" and the organization is set as active.
2. **Given** an organization owner, **When** they invite a colleague via email, **Then** the colleague receives an invitation link.
3. **Given** an invited user, **When** they accept the invitation, **Then** they are added to the organization with the specified role.
4. **Given** a user in multiple organizations, **When** they switch organizations, **Then** the dashboard updates to show data for the selected organization only.

---

### User Story 3 - Billing & Subscriptions (Priority: P2)

As an organization owner, I want to subscribe to a paid plan so that I can access premium features.

**Why this priority**: Monetization is essential for a SaaS business. This validates the billing infrastructure.

**Independent Test**: Can be tested by using test card credentials to upgrade an organization to a paid plan.

**Acceptance Scenarios**:

1. **Given** an organization on a free plan, **When** the owner selects a paid tier, **Then** they are redirected to a secure checkout page.
2. **Given** a successful payment, **When** the user returns to the app, **Then** the organization status is updated to "Active/Paid" immediately.
3. **Given** a subscribed organization, **When** the owner views the billing portal, **Then** they can see invoices and manage payment methods.
4. **Given** a subscription cancellation, **When** the period ends, **Then** the organization reverts to the free/limited state.

---

### User Story 4 - Dashboard & Settings (Priority: P2)

As a user, I want a responsive dashboard and settings area so that I can manage my profile and preferences.

**Why this priority**: Provides the primary interface for users to interact with the system and validates the UI foundation.

**Independent Test**: Can be tested by navigating the dashboard on mobile and desktop, changing themes, and updating profile data.

**Acceptance Scenarios**:

1. **Given** any user, **When** they toggle the theme (Dark/Light), **Then** the UI updates immediately and persists the preference.
2. **Given** a user on a mobile device, **When** they access the dashboard, **Then** the sidebar is collapsible and navigation remains accessible.
3. **Given** a user in settings, **When** they update their name or avatar, **Then** the changes are reflected across the app.

### Edge Cases

- What happens when a user attempts to access a resource from an organization they don't belong to? (Must return 403 Forbidden).
- How does the system handle a failed payment webhook? (Should retry or mark subscription as past due, notifying the user).
- What happens if an invitation link expires? (User should see a clear error and request a new one).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST use Supabase Auth for handling sign-up, sign-in, and session management.
- **FR-002**: System MUST enforce Organization-Based Isolation (Row Level Security) for all business data.
- **FR-003**: System MUST support Role-Based Access Control (RBAC) with at least 'Owner' and 'Member' roles.
- **FR-004**: System MUST integrate with a Generic/Abstract Payment Adapter (Strategy Pattern) to support future flexibility in selecting payment providers.
- **FR-005**: System MUST provide a customer portal for users to manage their billing details (invoices, cards).
- **FR-006**: System MUST send transactional emails (welcome, invite, password reset) using React Email templates.
- **FR-007**: Frontend MUST use `shadcn/ui` components and Tailwind CSS for all UI elements.
- **FR-008**: System MUST implement Restrictive Member permissions: 'Owners' have full administrative control; 'Members' can read and write business data but CANNOT manage invitations, view billing information, or modify organization settings.

### Key Entities *(include if feature involves data)*

- **User**: Represents a global identity (Supabase User).
- **Organization**: A tenant container for data and members.
- **Member**: A link between User and Organization, storing the Role.
- **Subscription**: Records the billing status, plan ID, and validity period for an Organization.
- **Invoice**: A record of past payments linked to a Subscription.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete the "Sign Up -> Create Org -> Dashboard" flow in under 2 minutes.
- **SC-002**: Dashboard pages achieve a Lighthouse Performance score of >90 on desktop.
- **SC-003**: System successfully handles upgrading an organization to a paid plan using test credentials.
- **SC-004**: 100% of API endpoints enforcing RLS (Row Level Security) prevent cross-organization data access.