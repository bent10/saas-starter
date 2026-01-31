# Research: Fix Auth Redirects

## Findings

### 1. Localization of Auth Links

**Problem**: The "Sign in" and "Sign up" links in `SignInForm` and `SignUpForm` (`features/auth/components/`) use `next/link` with hardcoded paths (e.g., `/register`), bypassing the active locale.
**Solution**:

- Create a `shared/lib/navigation.ts` utility using `next-intl/navigation` to export locale-aware `Link`, `redirect`, `usePathname`, and `useRouter`.
- Replace imports in auth forms to use this shared `Link`.

### 2. Middleware Redirects

**Problem**: `proxy.ts` handles auth protection but hardcodes the fallback locale to `/en/` (e.g., `url.pathname = '/en/login'`). This breaks the experience for users on other locales.
**Solution**:

- Extract the locale from the request path or `next-intl` middleware config.
- Use the detected locale when constructing redirect URLs.
- Ensure `updateSession` (Supabase) doesn't interfere with the locale.

### 3. Server Action Redirects

**Problem**: `signIn` and `signOutAction` in `features/auth/actions/auth-actions.ts` use `next/navigation`'s `redirect` with hardcoded paths (`/dashboard`, `/login`), losing the locale.
**Solution**:

- Retrieve the current locale using `getLocale()` from `next-intl/server`.
- Construct the redirect path dynamically: `/${locale}/dashboard`.

### 4. Google OAuth Error

**Problem**: User reports `Unsupported provider: provider is not enabled`.
**Analysis**: The code calls `signInWithOAuth({ provider: 'google', ... })`. This is syntactically correct.
**Root Cause**: The error message comes directly from Supabase, indicating the Google provider is not enabled in the Supabase Dashboard > Authentication > Providers.
**Action**:

- Verify code passes correct `redirectTo`: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`.
- The fix is primarily configuration, but we will ensure the callback route (`app/auth/callback/route.ts`) properly handles the session exchange and redirects to `/${locale}/dashboard`. currently it redirects to `next` param or `/dashboard` (missing locale).

### 5. Logout Flow

**Problem**: Logout needs to redirect to `/${locale}/login`.
**Solution**: Update `signOutAction` to fetch locale and redirect.

## Decisions

- **Navigation Lib**: standard `next-intl` navigation wrapper in `shared/lib/navigation.ts`.
- **Locale Detection**: Use `next-intl`'s `getLocale` in Server Actions. Use URL segments in Middleware.
- **Redirects**: Always include `${locale}` prefix.

## Alternatives Considered

- **Client-side redirects**: Rejected. Server-side redirects (Middleware/Actions) are faster and more secure (prevent flashing).
- **Hardcoding 'id'**: Rejected. Must support all configured locales (currently 'en', but extensible).
