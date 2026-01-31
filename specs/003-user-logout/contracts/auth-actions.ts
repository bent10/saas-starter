// Server Action Contract
// Location: features/auth/actions/auth-actions.ts

/**
 * Signs the user out of the application.
 *
 * - Invalidates the Supabase session.
 * - Clears authentication cookies.
 * - Redirects the user to the login page.
 *
 * @returns {Promise<void>}
 */
export async function signOutAction(): Promise<void>
