# Contracts: Auth Actions

## Server Actions (`features/auth/actions/auth-actions.ts`)

### `signIn`

- **Signature**: `signIn(data: z.infer<typeof signInSchema>): Promise<{ error?: string } | void>`
- **Behavior**: Validates credentials. On success, redirects to `/:locale/dashboard`. On failure, returns error.

### `signUp`

- **Signature**: `signUp(data: z.infer<typeof signUpSchema>): Promise<{ success?: boolean, error?: string }>`
- **Behavior**: Creates account. On success, sends verification email (or signs in if auto-confirm). Returns success status.

### `signOutAction`

- **Signature**: `signOutAction(): Promise<void>`
- **Behavior**: Signs out. Redirects to `/:locale/login`.

### `signInWithGoogle`

- **Signature**: `signInWithGoogle(): Promise<void>`
- **Behavior**: Initiates OAuth flow. Redirects to provider.
- **Callback**: Returns to `/auth/callback`.

## API Routes

### `/auth/callback`

- **Method**: `GET`
- **Query Params**: `code`, `next` (optional)
- **Behavior**: Exchanges code for session. Redirects to `next` (which should include locale) or `/:locale/dashboard`.
