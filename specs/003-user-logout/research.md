# Research: User Logout

**Feature**: User Logout
**Status**: Complete

## Decisions

### Logout Implementation

- **Decision**: Use a Next.js Server Action invoking Supabase's `signOut()` method.
- **Rationale**:
  - **Security**: Server Actions run on the server, allowing direct manipulation of cookies (via `@supabase/ssr`) to securely clear the session.
  - **Performance**: Reduces client-side JavaScript bundle size compared to client-side only SDK usage.
  - **Consistency**: Aligns with the project's use of Next.js App Router and Server Components.
- **Alternatives Considered**:
  - _Client-side `supabase.auth.signOut()`_: rejected because it requires ensuring the client and server state (cookies) stay in sync, which can be flaky; Server Actions are more robust for cookie management in App Router.

### Redirect Strategy

- **Decision**: Redirect to `/login` after successful logout.
- **Rationale**: Standard UX pattern; prevents user from remaining on a protected page.

## Technical Details

- **Supabase Client**: Use `createClient` from `@supabase/ssr` with cookie handling in the Server Action.
- **Route Handling**: `redirect('/login')` from `next/navigation` should be called _after_ `signOut` to trigger the client-side navigation.
