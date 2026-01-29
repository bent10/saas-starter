# Implementation Plan: SaaS Starter Core

**Branch**: `001-saas-starter-core` | **Date**: 2026-01-29 | **Spec**: `/specs/001-saas-starter-core/spec.md`
**Input**: Feature specification from `/specs/001-saas-starter-core/spec.md`

## Summary

This feature implements the core foundation of the SaaS Starter, including User Authentication (Supabase Auth), Multi-Tenancy (Organization-based isolation), Billing (Stripe), and Settings. It establishes the "Strict Domain-Based" folder structure in a Next.js App Router project, ensuring a scalable and production-ready architecture.

## Technical Context

**Language/Version**: TypeScript v5 (Strict), Node.js (ESM)
**Primary Dependencies**: Next.js 16.1.4 (App Router), Supabase (Auth, DB, Storage), Drizzle ORM, Zod, Stripe, React Email/Resend, next-intl, Playwright.
**Storage**: PostgreSQL (Supabase), Supabase Storage.
**Testing**: Playwright (E2E), Vitest (Unit/Integration - inferred).
**Target Platform**: Vercel (Edge/Serverless).
**Project Type**: Full-stack Web Application (Next.js).
**Performance Goals**: Core Web Vitals (LCP, CLS, INP) in Green.
**Constraints**: Strict RLS for data isolation, Mobile-first design, Dark/Light mode support.
**Scale/Scope**: Foundation for scalable SaaS, handling multi-tenancy and billing from day one.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle        | Status | Notes                                                     |
| :--------------- | :----- | :-------------------------------------------------------- |
| **Code Quality** | ✅     | Strict TS, ESM, Prettier, ESLint enforced.                |
| **UI/UX**        | ✅     | shadcn/ui, Tailwind, Dark/Light mode, Mobile-first.       |
| **Testing**      | ✅     | Playwright for E2E, Integration tests for critical paths. |
| **Performance**  | ✅     | Server Components default, Green Web Vitals target.       |
| **Tech Stack**   | ✅     | Supabase, Drizzle, Zod, React Email adopted.              |

## Project Structure

### Documentation (this feature)

```text
specs/001-saas-starter-core/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
/
├── app/                 # Next.js App Router (Routes & Layouts)
│   ├── [locale]/        # i18n routing
│   │   ├── (auth)/      # Auth routes
│   │   ├── (dashboard)/ # App routes (protected)
│   │   └── api/         # API routes (webhooks, etc.)
├── features/            # Domain-based modules
│   ├── auth/            # Auth logic (components, actions, hooks)
│   ├── billing/         # Billing logic
│   ├── marketing/       # Landing page logic
│   └── org/             # Organization/Multi-tenancy logic
├── shared/              # Shared utilities & UI
│   ├── components/      # Generic UI components (shadcn/ui)
│   ├── hooks/           # Shared hooks
│   └── lib/             # Shared libs (db, env, utils)
├── .specify/            # Project rules & templates
└── specs/               # Feature specs & plans
```

**Structure Decision**: Adopting "Strict Domain-Based" structure with `features/` and `shared/` directories to improve maintainability and separation of concerns, keeping `app/` minimal for routing.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       |            |                                      |

## Phases

### Phase 0: Outline & Research

1.  **Clarifications**:
    - Folder structure: Strict Domain-Based.
    - i18n: `next-intl`.
    - Commits: Conventional Commits.
    - CI/CD: GitHub Actions.
    - E2E: Playwright.
2.  **Research Tasks**:
    - [x] Confirm `next-intl` setup with App Router.
    - [x] Verify Drizzle ORM pattern for Supabase Auth RLS integration.
    - [x] Define "Strict Domain-Based" folder structure details.

### Phase 1: Design & Contracts

1.  **Data Model**: Define `User`, `Organization`, `Member`, `Subscription`, `Invoice`.
2.  **Contracts**: Define Server Actions for Auth, Org, and Billing.
3.  **Quickstart**: Define developer onboarding steps.

### Phase 2: Implementation (Planned)

1.  **Scaffolding**: Setup folder structure, DB, i18n, Layouts.
2.  **Auth**: Implement Sign-up, Sign-in, MFA.
3.  **Org**: Implement Create Org, Invite Member, RLS.
4.  **Billing**: Implement Stripe integration.
5.  **Validation**: E2E tests.
