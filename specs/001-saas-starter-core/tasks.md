# Tasks: SaaS Starter Core

**Input**: Design documents from `/specs/001-saas-starter-core/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/
**Tests**: Tests are included as tasks where applicable, focusing on E2E integration per research.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency installation, and structural alignment.

- [X] T001 Initialize strict domain-based folder structure (create `features/`, `shared/`, move `components/` to `shared/`)
- [X] T002 [P] Install core dependencies (`supabase-js`, `drizzle-orm`, `postgres`, `zod`, `stripe`, `resend`, `next-intl`)
- [X] T003 [P] Configure Drizzle ORM (drizzle.config.ts) and Supabase client (lib/supabase/client.ts, lib/supabase/server.ts)
- [X] T004 [P] Configure `next-intl` (i18n.ts, middleware.ts update) and basic locale structure

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, global layouts, and core UI components.

**⚠️ CRITICAL**: Must complete before user stories.

- [X] T005 Define Drizzle schema for `organizations`, `members`, `invitations`, `subscriptions` in `lib/db/schema.ts`
- [X] T006 Run migration/push schema to Supabase to establish database structure
- [X] T007 [P] Create generic `shared/components/ui` wrappers if needed (ensure shadcn is fully in `shared/components/ui`)
- [X] T008 Implement Root Layout with Providers (Theme, Query, i18n) in `app/[locale]/layout.tsx`
- [X] T009 Create basic API route structure in `app/[locale]/api/`
- [X] T031 Configure Supabase Storage buckets (`avatars`, `logos`) and RLS policies
- [X] T032 Setup structured JSON logging utility in `shared/lib/logger.ts`

**Checkpoint**: Foundation ready - DB exists, App runs with i18n and providers.

## Phase 3: User Story 1 - Auth & Onboarding (Priority: P1) 🎯 MVP

**Goal**: Users can sign up, sign in, and are forced to create an organization (onboarding).

**Independent Test**: Register new user -> Redirect to Onboarding -> Create Org -> Land on Dashboard.

### Implementation for User Story 1

- [X] T010 [P] [US1] Implement Auth Server Actions (`signUp`, `signIn`, `signOut`) in `features/auth/actions/auth-actions.ts`
- [X] T011 [P] [US1] Create Auth Forms (SignUpForm, SignInForm) in `features/auth/components/`
- [X] T012 [US1] Create Auth Pages (Register, Login) in `app/[locale]/(auth)/login/page.tsx` and `register/page.tsx`
- [X] T013 [US1] Implement "Create Organization" onboarding step (form & action) in `features/auth/components/onboarding.tsx`
- [X] T014 [US1] Protect dashboard routes via Middleware (redirect unauthenticated to login)

**Checkpoint**: User can log in and owns an organization.

## Phase 4: User Story 2 - Organization Management (Priority: P1)

**Goal**: Org owners can manage members and switch organizations.

**Independent Test**: Create 2nd Org -> Switch context -> Invite member -> Member accepts.

### Implementation for User Story 2

- [X] T015 [P] [US2] Implement Org Server Actions (`inviteMember`, `switchOrganization`) in `features/org/actions/org-actions.ts`
- [X] T016 [P] [US2] Create Org Dashboard Layout (Sidebar, OrgSwitcher) in `app/[locale]/(dashboard)/[slug]/layout.tsx`
- [X] T017 [US2] Implement Member List & Invite UI in `features/org/components/member-management.tsx`
- [X] T018 [US2] Create Invitation Acceptance Page in `app/[locale]/(auth)/invite/[token]/page.tsx`
- [X] T019 [US2] Implement RLS policies verification (ensure users can't see other orgs)
- [X] T033 [US2] Create React Email templates (Invite, Welcome) in `features/org/emails/`

**Checkpoint**: Multi-tenancy is fully functional.

## Phase 5: User Story 3 - Billing & Subscriptions (Priority: P2)

**Goal**: Organizations can subscribe to paid plans via Stripe.

**Independent Test**: Upgrade to Pro -> Verify Stripe Checkout -> Return to App -> Status updated.

### Implementation for User Story 3

- [X] T020 [P] [US3] Implement Billing Actions (`createCheckoutSession`, `createPortalSession`) in `features/billing/actions/billing-actions.ts`
- [X] T021 [US3] Setup Stripe Webhook Handler (listen for `checkout.session.completed`) in `app/api/webhooks/stripe/route.ts`
- [X] T022 [US3] Create Pricing Page UI in `features/billing/components/pricing.tsx`
- [X] T023 [US3] Integrate Subscription Status check in Dashboard Layout (lock features if needed)

**Checkpoint**: Monetization flow is working.

## Phase 6: User Story 4 - Dashboard & Settings (Priority: P2)

**Goal**: User profile management and global settings.

**Independent Test**: Change Theme -> Persists; Update Profile -> Reflected.

### Implementation for User Story 4

- [X] T024 [P] [US4] Create User Settings Page (Profile form) in `app/[locale]/(dashboard)/account/page.tsx`
- [X] T025 [P] [US4] Implement Theme Toggle in `shared/components/theme-toggle.tsx`
- [X] T026 [US4] Ensure mobile responsiveness for Sidebar and Dashboard components

**Checkpoint**: User experience is polished.

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Testing, cleanup, and final validation.

- [X] T027 [P] Configure Playwright and write E2E test for Critical Path (Auth -> Org -> Billing)
- [X] T028 Audit all `any` types and ensure Strict Mode compliance
- [X] T029 Verify Web Vitals (LCP) on Dashboard
- [X] T030 Final documentation update (README.md usage instructions)
- [X] T034 Implement basic Audit Log for critical actions (Login, Invite, Role Change)

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Blocks everything.
- **Foundational (Phase 2)**: Blocks all User Stories.
- **User Stories (Phase 3+)**: US1 is the prerequisite for US2 and US3. US2 and US3 can run in parallel after US1.
- **Polish (Phase 7)**: Run after US4.

### Parallel Opportunities

- T002, T003, T004 can run in parallel.
- T010 and T011 (Auth Backend vs Frontend) can be parallelized.
- T015 (Org Actions) and T016 (Org Layout) can be parallelized.
- US2 (Org) and US3 (Billing) are largely independent once US1 (Auth) is done.

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup & Foundational.
2. Implement US1 (Auth & Onboarding).
3. Implement US2 (Basic Org Management).
4. Validate Multi-tenancy.

### Incremental Delivery

1. Foundation -> Deploy.
2. Auth -> Deploy.
3. Billing -> Deploy.
