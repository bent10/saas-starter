// Organization Module Server Actions

export type OrgState = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: any
}

/**
 * Creates a new organization and assigns the creator as OWNER.
 */
export declare function createOrganization(
  prevState: OrgState,
  formData: FormData
): Promise<OrgState>

/**
 * Updates organization metadata (Name, Slug, Logo).
 * Restricted to OWNER.
 */
export declare function updateOrganization(
  orgId: string,
  prevState: OrgState,
  formData: FormData
): Promise<OrgState>

/**
 * Invites a new member to the organization via email.
 * Restricted to OWNER (and paid plans).
 */
export declare function inviteMember(
  orgId: string,
  prevState: OrgState,
  formData: FormData
): Promise<OrgState>

/**
 * Removes a member from the organization.
 * Restricted to OWNER.
 */
export declare function removeMember(
  orgId: string,
  memberId: string
): Promise<OrgState>

/**
 * Changes a member's role (e.g., MEMBER -> OWNER).
 * Restricted to OWNER.
 */
export declare function updateMemberRole(
  orgId: string,
  memberId: string,
  newRole: 'OWNER' | 'MEMBER'
): Promise<OrgState>

/**
 * Switches the active organization context in the session/cookie.
 */
export declare function switchOrganization(orgId: string): Promise<void>
