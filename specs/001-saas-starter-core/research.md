# Research & Decisions: SaaS Starter Core

## Decisions

### 1. Folder Structure

- **Decision**: Strict Domain-Based Structure (`features/` and `shared/`).
- **Rationale**: Improves maintainability and scalability by grouping related code (UI, logic, state) by domain rather than technical type. Keeps `app/` focused purely on routing.
- **Alternatives**:
  - _Standard Next.js_: Rejected as it becomes messy at scale.
  - _Hybrid_: Rejected to enforce strict separation of concerns.

### 2. Internationalization (i18n)

- **Decision**: `next-intl`.
- **Rationale**: Native support for Next.js App Router and Server Components (RSC), lightweight, and type-safe.
- **Alternatives**:
  - _react-i18next_: Good but heavier and requires more boilerplate for RSC.

### 3. CI/CD & Automation

- **Decision**: GitHub Actions.
- **Rationale**: Integrated with the repository, cost-effective, and industry standard.
- **Alternatives**:
  - _Vercel_: Used for deployment, but GitHub Actions allows more granular control over testing and linting pipelines.

### 4. End-to-End Testing

- **Decision**: Playwright.
- **Rationale**: Faster, more reliable, and better integration with modern web standards than Cypress.

### 5. Git Convention

- **Decision**: Conventional Commits.
- **Rationale**: Enables automated changelogs and semantic versioning.

## Resolved Unknowns

- All critical architectural decisions (Auth, DB, Billing, UI) were pre-resolved in the TDD and Constitution.
- Specific library choices for i18n and testing were resolved during the Clarification phase.
