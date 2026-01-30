export type AuthError = {
  message: string
  code?: string
}

export type AuthResponse<T = void> = {
  success: boolean
  data?: T
  error?: AuthError
}

// --- Server Actions Contracts ---

// Login
export type LoginInput = {
  email: string
  password?: string // Optional if using magic link (future) or just structure
  code?: string // For 2FA or OTP
}
export type LoginOutput = AuthResponse<{ session: any; redirectUrl?: string }>

// Register
export type RegisterInput = {
  email: string
  password?: string
  fullName?: string
}
export type RegisterOutput = AuthResponse<{
  session: any
  requiresEmailVerification: boolean
}>

// Invite User
export type InviteUserInput = {
  organizationId: string
  email: string
  role: 'OWNER' | 'MEMBER'
}
export type InviteUserOutput = AuthResponse<{ invitationId: string }>

// Accept Invite
export type AcceptInviteInput = {
  token: string
  password?: string // If new user setting password
  fullName?: string // If new user
}
export type AcceptInviteOutput = AuthResponse<{ organizationId: string }>

// Forgot Password
export type ForgotPasswordInput = {
  email: string
}
export type ForgotPasswordOutput = AuthResponse

// Reset Password
export type ResetPasswordInput = {
  password: string
  code: string // The token from URL
}
export type ResetPasswordOutput = AuthResponse

// 2FA Setup
export type Enable2FAOutput = AuthResponse<{
  qrCode: string
  secret: string
  id: string
}>
export type Verify2FAInput = {
  factorId: string
  code: string
}
export type Verify2FAOutput = AuthResponse
