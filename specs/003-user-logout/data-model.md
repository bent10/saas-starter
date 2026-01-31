# Data Model: User Logout

**Status**: No Changes

## Schema Changes

There are no database schema changes required for this feature. Session management is handled by Supabase Auth (stateless JWTs + Refresh Tokens stored in cookies/internal Supabase tables), and no application-level tables need modification.
