# Tasks: User Logout

**Input**: Design documents from `specs/003-user-logout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included as per plan (E2E test).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `features/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify Supabase SSR client availability in shared/lib/supabase/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

_No new foundational infrastructure required for this feature._

---

## Phase 3: User Story 1 - Secure Logout (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can securely log out, invalidating their session and redirecting to the login page.

**Independent Test**: Log in -> Click Logout -> Verify redirect -> Verify back button/protected route access fails.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T002 [P] [US1] Create E2E test for logout flow in tests/e2e/logout.spec.ts

### Implementation for User Story 1

- [x] T003 [US1] Implement signOutAction in features/auth/actions/auth-actions.ts
- [x] T004 [US1] Update dashboard sidebar to include Logout button in features/org/components/dashboard-sidebar.tsx
- [x] T005 [US1] Connect Logout button to signOutAction in features/org/components/dashboard-sidebar.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T006 [P] Run quickstart.md validation steps manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3)**: Depend on Setup completion (Phase 2 is empty)
- **Polish (Final Phase)**: Depends on User Story 1 being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Actions/Services before UI components
- Story complete before moving to Polish

### Parallel Opportunities

- T002 (Test creation) and T003 (Action implementation) can theoretically run in parallel if contract is agreed, but TDD suggests Test first.
- T006 (Validation) runs after implementation.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1
   - Create E2E test
   - Implement Action
   - Update UI
   - Verify Test Passes
3. Complete Phase 4: Polish (Validate)
4. **STOP and VALIDATE**: Test User Story 1 independently
