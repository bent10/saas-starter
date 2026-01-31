# Implementation Plan: Fix Auth Redirects

**Branch**: `004-fix-auth-redirects` | **Date**: 2026-01-31 | **Spec**: [specs/004-fix-auth-redirects/spec.md](/specs/004-fix-auth-redirects/spec.md)
**Input**: Feature specification from `/specs/004-fix-auth-redirects/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature aims to resolve critical authentication workflow issues. Specifically, it addresses incorrect redirection targets after login and logout, enforces protection on secured routes for unauthenticated users, fixes navigation links between login and register pages, and resolves a configuration error preventing Google OAuth authentication. The implementation will leverage Next.js Middleware for route protection and Supabase Auth for session management.

## Technical Context

**Language/Version**: TypeScript v5 (Strict Mode)
**Primary Dependencies**: Next.js v16.1.4 (App Router), Supabase Auth, next-intl
**Storage**: Supabase (PostgreSQL) - User sessions managed by Supabase Auth
**Testing**: Playwright (E2E for auth flows)
**Target Platform**: Web (Next.js)
**Project Type**: Web Application
**Performance Goals**: Instant redirection (<200ms TTFB for redirects)
**Constraints**: Must support localization (URL prefixes) and prevent "flash of unauthenticated content".
**Scale/Scope**: Auth flows affecting all users.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Code Quality**: Strict TypeScript, ESM only, Prettier/ESLint compliance.
- [x] **UI/UX**: Uses shadcn/ui components (if any new UI), Mobile-first, A11y compliant.
- [x] **Architecture**: Uses Next.js App Router (Server Actions/Middleware), Supabase Auth.
- [x] **Testing**: Critical path (Login/Logout/Redirects) must be covered by E2E tests.
- [x] **Multi-Tenancy**: Supports organization-based isolation (via Supabase/RLS, though mostly auth-level here).

## Project Structure

### Documentation (this feature)

```text
specs/004-fix-auth-redirects/
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
│   ├── (auth)/          # Login/Register pages
│   └── dashboard/       # Protected route
├── auth/
│   └── callback/        # OAuth callback route
features/
└── auth/                # Auth actions and components
proxy.ts                 # Middleware for route protection
```

**Structure Decision**: Standard Next.js App Router structure with feature-sliced architecture for logic.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
