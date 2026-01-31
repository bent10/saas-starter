# Data Model: Fix Auth Redirects

## Entities

### User Session (Supabase Auth)

- **Source**: Supabase Auth (GoTrue)
- **Changes**: None. Session handling via `updateSession` in middleware is refined to preserve locale.

### Profiles

- **Table**: `public.profiles`
- **Changes**: None.
