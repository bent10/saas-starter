# Feature Specification: SaaS Starter Core

**Feature Branch**: `001-saas-starter-core`  
**Created**: 2026-01-29  
**Status**: Draft  
**Input**: User description: "Membangun SaaS Starter Template, sebuah fondasi siap produksi yang skalabel untuk membangun aplikasi SaaS modern. Template ini menyediakan fitur-fitur esensial seperti autentikasi, multi-tenancy, billing, serta sistem UI yang solid, sehingga tim dapat fokus pada diferensiasi produk alih-alih membangun infrastruktur dari nol. Lihat @README.md untuk informasi lebih detail."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication & Onboarding (Priority: P1)

As a new user, I want to sign up using my email or social account and set up my first organization so that I can start using the application immediately.

**Why this priority**: Authentication and initial organization setup are the gatekeepers for all other features.

**Independent Test**: Can be fully tested by registering a new account, completing the mandatory organization setup, and landing on the dashboard.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they choose "Sign Up", **Then** they register via Email/Password or Social Provider (Google) and MUST create an organization (or accept a pending invitation) to complete onboarding.
2. **Given** a registered user, **When** they log in with correct credentials, **Then** they are redirected to their active organization's dashboard.
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
- **FR-009**: System MUST enforce organization creation or association (joining an existing one) as a mandatory step in the onboarding flow before dashboard access.
- **FR-010**: System MUST automatically link social sign-in accounts to existing email/password accounts if they share the same verified email address.
- **FR-011**: System MUST restrict the ability to invite new members to organizations that have an active, non-canceled paid subscription.
- **FR-012**: System MUST invalidate all active sessions for a user upon a successful password change to ensure account security.
- **FR-013**: System MUST prevent organization deletion if other members exist; the owner must transfer ownership or remove all members first.
- **FR-014**: System MUST use path-based routing for organization context (e.g., `/[org-slug]/dashboard`) to support deep linking and multiple active tabs.
- **FR-015**: System MUST enforce globally unique URL slugs for every organization to ensure conflict-free path-based routing.
- **FR-016**: System MUST automatically associate new users with existing invitations matching their verified email address during the onboarding flow.
- **FR-017**: System MUST preserve all data created by a member within an organization upon their removal, transferring data ownership to the Organization Owner.
- **FR-018**: System MUST prevent sending multiple active invitations to the same email address for the same organization.
- **FR-019**: System MUST prevent downgrading to a lower plan if the current organization usage (e.g., member count) exceeds the limits of the target plan.
- **FR-020**: System MUST apply pro-rated credits for unused time on the current plan when a user upgrades to a higher tier.
- **FR-021**: System MUST restrict organization access (lock or limit features) immediately after the final failed payment retry attempt until billing is resolved.
- **FR-022**: System MUST restrict billing management (portal access, invoices, subscriptions) to the Organization Owner role only.
- **FR-023**: System MUST immediately revert organizations with expired subscriptions to the Free tier limits, revoking access to premium features and excess member seats.
- **FR-024**: System MUST support a two-tier language preference hierarchy: organizations set a default language, while individual users can override it for their personal view.
- **FR-025**: System MUST support a tri-state theme preference (Light, Dark, System) at the user level, persisting the choice across sessions.
- **FR-026**: System MUST restrict the ability to modify organization metadata (name, slug, logo) to the Organization Owner role only.
- **FR-027**: System MUST provide granular notification preferences, defaulting to enabled for critical events (billing, security, invitations) while allowing user opt-out.
- **FR-028**: System MUST immediately invalidate sessions and initiate permanent data removal upon user account deletion, unless the user is a sole owner of an organization.
- **FR-029**: System MUST use Structured JSON Logging for all server-side events to ensure compatibility with modern observability and log management tools.
- **FR-030**: System MUST implement Database-Backed Rate Limiting (using Postgres or Redis) to ensure consistent enforcement across horizontally scaled instances.
- **FR-031**: System MUST prioritize Comprehensive Integration Tests for critical paths (Auth, Billing, Multi-Tenancy) to verify database and API integrity.
- **FR-032**: System MUST implement Database-Based Feature Gating to manage plan limits and feature access dynamically without requiring code redeployments.
- **FR-033**: System MUST store and transmit all timestamps in Standard ISO-8601 (UTC) format to ensure global consistency and simplify timezone management.
- **FR-034**: System MUST implement a Comprehensive Audit Log system to track critical user actions (e.g., login, billing changes, permission updates) for security and compliance.
- **FR-035**: System MUST support Admin-Controlled Fine-Grained Permissions, allowing Organization Owners to toggle specific capabilities for different roles via the UI.
- **FR-036**: System MUST use Supabase Storage to manage custom assets (logos, avatars) and store the resulting URLs in the database for performant retrieval.
- **FR-037**: System MUST provide self-serve account and organization deletion directly in the settings UI for the respective owners.
- **FR-038**: System MUST utilize a strict domain-based folder structure (separating `features/` and `shared/` modules) to ensure maintainability and code isolation.
- **FR-039**: System MUST use `next-intl` for internationalization to provide native support for Next.js App Router and React Server Components.
- **FR-040**: System MUST follow the Conventional Commits specification for all git commit messages to ensure a structured and readable version history.
- **FR-041**: System MUST utilize GitHub Actions for CI/CD automation, including automated linting, type-checking, and test execution.
- **FR-042**: System MUST use Playwright for End-to-End (E2E) testing to ensure critical user journeys (Auth, Billing) remain functional across browsers.

## Clarifications

### Session 2026-01-29
- Q: User onboarding flow regarding organizations → A: Enforce Organization Creation during sign-up (no personal context).
- Q: Project folder structure strategy → A: Strict Domain-Based (features/ and shared/ dirs).
- Q: Internationalization (i18n) library selection → A: next-intl (native App Router & RSC support).
- Q: Git commit message convention → A: Conventional Commits (feat, fix, docs, etc.).
- Q: CI/CD platform for automation → A: GitHub Actions (integrated repository automation).
- Q: End-to-End (E2E) testing framework → A: Playwright (modern, cross-browser standard).
- Q: Handling multiple auth methods for same email → A: Automatic Linking by Email (unify social and email profiles).
- Q: Restrictions on sending invitations → A: Active Membership Required (only paid plans can invite members).
- Q: Session handling after password change → A: Clear All Sessions (invalidate all other active sessions).
- Q: Constraints on organization deletion → A: Block if Members Exist (prevent orphan memberships).
- Q: Multi-tenancy routing strategy → A: Path-Based Routing (e.g., `/[org-slug]/dashboard`).
- Q: Organization identity and URL slugs → A: Unique Slug per Organization (globally unique identifiers for URLs).
- Q: Handling existing invitations on sign-up → A: Active Invitation Linking (auto-associate invites with email).
- Q: Data ownership on member removal → A: Preserve Data (transfer ownership to Org Owner).
- Q: Duplicate invitation prevention → A: Active Invitation Guard (block duplicate pending invites).
- Q: Plan downgrade policy → A: Restrictive Gating (downgrade blocked until usage meets lower plan limits).
- Q: Handling plan upgrade billing → A: Pro-rata Credit (credit unused time toward new plan).
- Q: Access handling after payment failure → A: Immediate Restricted Access (lock/restrict on final failure).
- Q: Billing portal access control → A: Only Org Owners (only owners can manage billing).
- Q: Subscription cancellation policy → A: Plan Gating Logic (immediate revert to Free tier on expiration).
- Q: Language preference hierarchy → A: Two-Tier Hierarchy (Org default with User override).
- Q: Theme preference strategy → A: Tri-State Theme (Light, Dark, System).
- Q: Organization profile management permissions → A: Only Org Owners (only owners can modify metadata).
- Q: Notification preference management → A: Opt-in with Defaults (critical alerts on by default).
- Q: User account deletion policy → A: Immediate Action (hard reset and data removal).
- Q: Server-side logging strategy → A: Structured JSON Logging (machine-readable format for observability).
- Q: Rate limiting implementation → A: Database-Backed Rate Limiting (cluster-wide enforcement).
- Q: Primary testing focus for critical paths → A: Comprehensive Integration Tests (verify DB/API logic).
- Q: Feature gating implementation strategy → A: Database-Based Feature Gating (dynamic plan/feature management).
- Q: Timestamp storage and transmission standard → A: Standard ISO-8601 (UTC) (ensure global consistency).
- Q: Implementation of audit logs → A: Comprehensive Event Logging (track critical actions for compliance).
- Q: Granular permission management strategy → A: Admin-Controlled Fine-Grained Permissions (Owner-driven UI).
- Q: Strategy for storing custom assets → A: Database-Stored Assets (use Supabase Storage).
- Q: Account and organization deletion accessibility → A: Self-Serve Deletion (available in settings UI).

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