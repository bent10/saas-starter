<!--
Sync Impact Report:
- Version change: Template → 1.0.0
- Principles Established:
  - Code Quality & Style (from Prettier config + Context)
  - Frontend Design & UX (from User Input)
  - Testing & Reliability (New)
  - Performance & Scalability (New)
- Added Sections: N/A
- Removed Sections: N/A
- Templates Status:
  - .specify/templates/plan-template.md: ✅ Compatible (has Constitution Check)
  - .specify/templates/spec-template.md: ✅ Compatible
  - .specify/templates/tasks-template.md: ✅ Compatible
-->
# saas-starter Constitution

## Core Principles

### I. Code Quality & Style
**Code must be consistent, readable, and strictly typed.**
- **Formatting**: Strictly adhere to the project's Prettier configuration (single quotes, no semi, 2-space tab width).
- **Type Safety**: TypeScript strict mode is mandatory. No explicit `any` without documented justification.
- **Linting**: ESLint errors must be resolved before merging. Zero-tolerance for warnings in CI.
- **Module System**: Use ESM (`import`/`export`) exclusively. Dynamic imports for lazy loading where beneficial.

### II. Frontend Design & UX
**Create distinctive, production-grade interfaces that avoid generic "AI slop" aesthetics.**
- **Bold Aesthetic**: Commit to a clear conceptual direction (minimalist, maximalist, industrial, etc.). Avoid generic choices.
- **Typography & Color**: Use distinctive fonts and cohesive, high-contrast color palettes.
- **Motion & Depth**: Utilize animations (CSS/Motion) for delight. Use layering, shadows, and spatial composition to create depth.
- **Mobile-First**: Designs must be responsive and fully functional on mobile devices first, then scale up.
- **Detail**: Meticulous attention to spacing, negative space, and micro-interactions.

### III. Testing & Reliability
**Reliability is non-negotiable for a scalable SaaS.**
- **Critical Paths**: User authentication, payments, and core business logic MUST have automated test coverage.
- **Test-First Mindset**: Tests SHOULD be written or planned before implementation for complex logic.
- **Regression**: New features MUST NOT break existing functionality. Run relevant test suites before pushing.

### IV. Performance & Scalability
**Performance is a feature; the application must remain fast as it grows.**
- **Web Vitals**: Aim for green Core Web Vitals (LCP, CLS, INP).
- **Server Components**: Prefer Next.js Server Components for data fetching and heavy rendering to reduce client bundle size.
- **Optimization**: Optimize images, fonts, and scripts. Lazy load non-critical components.

## Governance

### Amendment Process
- Proposed changes to this constitution must be reviewed by the project lead.
- Changes to "Core Principles" require a MINOR version bump.
- Clarifications or non-semantic updates require a PATCH version bump.

### Compliance
- **Plan Phase**: Every feature plan must explicitly check against these principles in the "Constitution Check" section.
- **Code Review**: PRs must be verified against Code Quality and Design principles.
- **Runtime Guidance**: Refer to `README.md` and `.specify/templates/` for operational details.

**Version**: 1.0.0 | **Ratified**: 2026-01-27 | **Last Amended**: 2026-01-27