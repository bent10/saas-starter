# Server Actions Contracts

## Auth Actions (`features/auth/actions/auth-actions.ts`)

### `signUp(data: SignUpSchema)`

- **Input**: `{ email, password, full_name? }`
- **Output**: `{ success: boolean, error?: string }`
- **Logic**: Calls `supabase.auth.signUp`. Creates `Profile` entry.

### `signIn(data: SignInSchema)`

- **Input**: `{ email, password }`
- **Output**: `{ success: boolean, error?: string }`
- **Logic**: Calls `supabase.auth.signInWithPassword`. Checks `Profile.status`.

### `signInWithGoogle()`

- **Input**: None (Triggered by form submission)
- **Output**: Redirects to Google OAuth URL.

### `signOut()`

- **Input**: None
- **Output**: Redirects to `/login`.

### `resetPassword(email: string)`

- **Input**: `{ email }`
- **Output**: `{ success: boolean, message: string }`
- **Logic**: Calls `supabase.auth.resetPasswordForEmail`.

### `updatePassword(password: string)`

- **Input**: `{ password }`
- **Output**: `{ success: boolean }`
- **Logic**: Calls `supabase.auth.updateUser`.

## Invitation Actions (`features/org/actions/invitation-actions.ts`)

### `createInvitation(data: CreateInvitationSchema)`

- **Input**: `{ email, role, organizationId }`
- **Output**: `{ success: boolean, invitationId?: string }`
- **Logic**:
  1. Checks if inviter is Admin/Owner.
  2. Creates `Invitation` record.
  3. Sends email via Resend.

### `acceptInvitation(token: string, method: 'password' | 'google', password?: string)`

- **Input**: `{ token, method, password? }`
- **Output**: `{ success: boolean, error?: string }`
- **Logic**:
  1. Validates token.
  2. If `method === 'password'`: Calls `signUp` (if new user) or links existing.
  3. If `method === 'google'`: Triggers OAuth flow with `next=/api/auth/callback?invite_token=...`.
  4. Updates `Invitation` status to `accepted`.
  5. Adds user to `Members` table.

## Admin Actions (`features/admin/actions/user-actions.ts`)

### `banUser(userId: string)`

- **Input**: `{ userId }`
- **Output**: `{ success: boolean }`
- **Logic**: Updates `Profile.status = 'banned'`. Optionally calls `supabase.auth.admin.deleteUser` session.
