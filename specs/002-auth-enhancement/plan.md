# Implementation Plan: Enhanced Authentication System

**Branch**: `002-auth-enhancement` | **Date**: 2026-01-30 | **Spec**: [specs/002-auth-enhancement/spec.md](./spec.md)
**Input**: Feature specification from `specs/002-auth-enhancement/spec.md`

## Summary

Implement a comprehensive authentication system including Email/Password and Google OAuth, Organization-based invitations with flexible acceptance (Password or Google), Two-Factor Authentication (TOTP), and User Banning. The system will leverage Supabase Auth for identity, Drizzle ORM for data management (Profiles, Invitations), and Next.js Middleware for security enforcement.

## Technical Context

**Language/Version**: TypeScript v5 (Strict Mode)
**Framework**: Next.js 16.1.4 (App Router)
**Primary Dependencies**: Supabase SSR, Drizzle ORM, Zod, React Email, Resend, shadcn/ui
**Storage**: PostgreSQL (Supabase)
**Testing**: Playwright (E2E)
**Target Platform**: Vercel / Node.js (ESM)
**Project Type**: Web Application (Next.js)
**Performance Goals**: <200ms auth latency, immediate session invalidation for banned users
**Constraints**:

- Must use Supabase Auth for identity.
- Must support Multi-tenancy (Organization invites).
- Strict separation of public profiles and auth data.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Strict TypeScript**: No `any`, strict mode enabled.
- [x] **ESM Only**: Using `import/export`.
- [x] **UI Standards**: shadcn/ui + Tailwind CSS.
- [x] **Supabase & Drizzle**: Core stack for Auth and Data.
- [x] **Multi-Tenancy**: Invitations are scoped to `organizationId`.
- [x] **Testing**: Critical path (Auth) coverage required via Playwright.

## Project Structure

### Documentation (this feature)

```text
specs/002-auth-enhancement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
app/
├── [locale]/
│   ├── (auth)/          # Login, Register, Forgot Password, Verify
│   └── (dashboard)/     # Protected routes
└── api/
    ├── auth/            # Callback routes (OAuth)
    └── webhooks/        # Supabase webhooks (if needed)

features/
├── auth/                # Auth components, actions, schemas
│   ├── actions/
│   ├── components/
│   └── schemas.ts
├── org/                 # Organization/Invitation logic
│   └── emails/          # React Email templates
└── shared/              # Shared utilities
```

**Structure Decision**: Standard "Feature-Sliced" modular architecture within Next.js App Router, grouping related logic in `features/` and routing in `app/`.

## Complexity Tracking

| Violation          | Why Needed                                 | Simpler Alternative Rejected Because                                                        |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Custom Invite Flow | Need flexible acceptance (Google/Password) | Supabase native invites enforce password set and don't support "Accept with Google" easily. |
