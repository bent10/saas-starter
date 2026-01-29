# GEMINI.md - Context & Instructions

## Project Overview

**Name:** `saas-starter`
**Description:** A scalable, production-ready foundation for building modern SaaS applications.
**Goal:** To accelerate SaaS development by providing essential features like authentication, multi-tenancy, billing, and a solid UI system.

## Tech Stack & Configuration

This project is configured as an **ESM module** (`"type": "module"`).

### Core

- **Framework:** Next.js 16.1.4 (App Router)
- **Language:** TypeScript v5 (Strict Mode required)
- **Runtime:** Node.js (ESM)

### Frontend & UI

- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (New York style)
- **Icons:** Lucide React
- **Theming:** `next-themes` (Dark/Light mode support required)
- **Utils:** `clsx`, `tailwind-merge`

### Backend & Data (Planned/Mandated)

_Note: These dependencies are mandated by the project Constitution but may not yet be installed in `package.json`._

- **Database:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Email:** React Email with Nodemailer/Resend

## Development Standards (Constitution)

Adhere strictly to the rules defined in `.specify/memory/constitution.md`.

1.  **Code Quality:**
    - **Strict TypeScript:** No implicit `any`. Explicit `any` requires justification.
    - **ESM Only:** Use `import`/`export`.
    - **Linting:** Zero tolerance for ESLint errors or warnings in CI.
    - **Formatting:** Prettier (single quotes, no semi, 2-space tab).

2.  **UI/UX:**
    - **Shadcn/UI:** Must use as the component base.
    - **Responsiveness:** Mobile-first approach.
    - **Accessibility:** Mandatory keyboard navigation and contrast compliance.

3.  **Architecture:**
    - **Next.js App Router:** Use Server Components by default.
    - **Multi-Tenancy:** Architecture must support organization-based data isolation.

## Project Structure

```text
/
├── app/                 # Next.js App Router pages and layouts
├── components/
│   └── ui/              # shadcn/ui components
├── lib/
│   └── utils.ts         # Utility functions (cn helper)
├── .specify/            # Project rules, memory, and templates
├── .gemini/             # AI Agent configuration
├── next.config.ts       # Next.js configuration
├── package.json         # Project dependencies and scripts
└── README.md            # Product Requirements Document (PRD)
```

## Key Commands

| Command         | Description                          |
| :-------------- | :----------------------------------- |
| `npm run dev`   | Start the development server         |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server          |
| `npm run lint`  | Run ESLint                           |

## Current Status & Next Steps

- **Frontend Scaffolding:** Complete with Next.js 16, Tailwind v4, and Shadcn UI.
- **Backend Setup:** **Pending.** Supabase and Drizzle are defined in the requirements but missing from `package.json`.
- **Immediate Task:** The project is in the "starter" phase. Future tasks will likely involve integrating the backend stack (Supabase/Drizzle) and implementing the authentication/multi-tenancy features described in the README.
