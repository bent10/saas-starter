# Implementation Plan: User Logout

**Branch**: `003-user-logout` | **Date**: Saturday, January 31, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/003-user-logout/spec.md`

## Summary

Implement secure user logout functionality using Supabase Auth's `signOut()` method within a Next.js Server Action. The logout action will be triggered from the user profile menu, ensuring session invalidation and redirection to the login page.

## Technical Context

**Language/Version**: TypeScript v5 (Strict)
**Primary Dependencies**: Next.js v16 (App Router), Supabase Auth (`@supabase/ssr`), Shadcn/UI
**Storage**: N/A (Supabase Auth handled internally)
**Testing**: Playwright (E2E)
**Target Platform**: Web (Next.js)
**Project Type**: Web Application
**Performance Goals**: Logout < 1s latency
**Constraints**: Must work with standard Supabase Auth cookies
**Scale/Scope**: Impacts all authenticated users

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Strict TypeScript**: Code will be strictly typed.
- [x] **ESM**: Using standard ESM imports.
- [x] **Shadcn/UI**: Using existing UI components for the trigger.
- [x] **Supabase/Drizzle**: Using Supabase for Auth (mandated).
- [x] **Testing**: E2E test will be added.

## Project Structure

### Documentation (this feature)

```text
specs/003-user-logout/
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # Schema changes (none)
├── quickstart.md        # Testing guide
├── contracts/           # API/Action contracts
│   └── auth-actions.ts
└── tasks.md             # Tasks (to be created)
```

### Source Code

```text
features/
└── auth/
    └── actions/
        └── auth-actions.ts       # Update: Add signOutAction

features/
└── org/
    └── components/
        └── dashboard-sidebar.tsx # Update: Add logout button to user menu

tests/
└── e2e/
    └── logout.spec.ts            # New: Logout E2E test
```

**Structure Decision**: Extending existing `auth` feature for the action and `org` feature (where the sidebar/layout lives) for the UI trigger.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
