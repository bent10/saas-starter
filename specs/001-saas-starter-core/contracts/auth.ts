// Auth Module Server Actions

export type AuthState = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Signs up a new user via Supabase Auth.
 * Automatically creates an organization if not joining via invite.
 */
export declare function signUp(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState>

/**
 * Signs in an existing user.
 */
export declare function signIn(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState>

/**
 * Signs out the current user.
 */
export declare function signOut(): Promise<void>

/**
 * Initiates password reset flow.
 */
export declare function forgotPassword(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState>

/**
 * Completes password reset with new password.
 */
export declare function updatePassword(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState>

/**
 * Authenticates with a social provider (OAuth).
 */
export declare function signInWithProvider(
  provider: 'google' | 'github'
): Promise<void>
