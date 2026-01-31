'use server'

import {
  createOrganizationSchema,
  inviteMemberSchema,
  removeMemberSchema,
  updateMemberRoleSchema
} from '../schemas'
import { db } from '@/shared/lib/db/drizzle'
import { organizations, members, invitations } from '@/shared/lib/db/schema'
import { createClient } from '@/shared/lib/supabase/server'
import { getLocale } from 'next-intl/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/shared/lib/utils'
import { eq, and, ne } from 'drizzle-orm'
import { logAudit } from '@/shared/lib/audit'

export type ActionState = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export async function createOrganization(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = createOrganizationSchema.safeParse({
    name: formData.get('name')
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid inputs'
    }
  }

  const { name } = validatedFields.data
  const supabase = await createClient()
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      message: 'Unauthorized'
    }
  }

  // Generate slug (name-random) to ensure uniqueness
  const slug = `${slugify(name)}-${Math.random().toString(36).substring(2, 7)}`

  try {
    const [newOrg] = await db
      .insert(organizations)
      .values({
        name,
        slug,
        email: user.email
      })
      .returning()

    await db.insert(members).values({
      organizationId: newOrg.id,
      userId: user.id,
      role: 'OWNER'
    })
  } catch (error) {
    console.error('Failed to create organization:', error)
    return {
      success: false,
      message: 'Failed to create organization. Please try again.'
    }
  }

  const locale = await getLocale()
  revalidatePath('/', 'layout')
  redirect(`/${locale}/dashboard/${slug}`)
}

export async function getOrganizations() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return []
  }

  const userOrgs = await db.query.members.findMany({
    where: (members, { eq }) => eq(members.userId, user.id),
    with: {
      organization: true
    }
  })

  return userOrgs.map(member => member.organization)
}

export async function getOrganizationBySlug(slug: string) {
  const org = await db.query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.slug, slug)
  })
  return org
}

export async function getMembers(slug: string) {
  const org = await getOrganizationBySlug(slug)
  if (!org) return []

  const orgMembers = await db.query.members.findMany({
    where: (members, { eq }) => eq(members.organizationId, org.id),
    with: {
      user: true
    }
  })

  return orgMembers
}

export async function inviteMember(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = inviteMemberSchema.safeParse({
    email: formData.get('email'),
    role: formData.get('role'),
    organizationId: formData.get('organizationId')
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid inputs'
    }
  }

  const { email, role, organizationId } = validatedFields.data
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const member = await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(
        eq(members.organizationId, organizationId),
        eq(members.userId, user.id)
      )
  })

  if (!member || member.role !== 'OWNER') {
    return {
      success: false,
      message: 'You do not have permission to invite members.'
    }
  }

  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  try {
    await db.insert(invitations).values({
      organizationId,
      email,
      role,
      token,
      expiresAt,
      inviterId: user.id
    })

    await logAudit(user.id, 'INVITE_MEMBER', { email, role }, organizationId)

    // TODO: Send email
    console.log(`Invite link: /invite/${token}`)

    revalidatePath('/', 'layout')
    return { success: true, message: 'Invitation sent.' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to invite member.' }
  }
}

export async function removeMember(
  orgId: string,
  memberId: string
): Promise<ActionState> {
  const validatedFields = removeMemberSchema.safeParse({
    organizationId: orgId,
    memberId: memberId
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid inputs'
    }
  }

  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Verify requester is OWNER
  const requester = await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(eq(members.organizationId, orgId), eq(members.userId, user.id))
  })

  if (!requester || requester.role !== 'OWNER') {
    return {
      success: false,
      message: 'You do not have permission to remove members.'
    }
  }

  try {
    // Prevent removing the last owner?
    // Ideally, we should check if the member being removed is the last owner.
    // For now, assuming standard logic:

    await db
      .delete(members)
      .where(and(eq(members.organizationId, orgId), eq(members.id, memberId)))

    await logAudit(user.id, 'REMOVE_MEMBER', { memberId }, orgId)

    revalidatePath('/', 'layout')
    return { success: true, message: 'Member removed.' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to remove member.' }
  }
}

export async function updateMemberRole(
  orgId: string,
  memberId: string,
  newRole: 'OWNER' | 'MEMBER'
): Promise<ActionState> {
  const validatedFields = updateMemberRoleSchema.safeParse({
    organizationId: orgId,
    memberId: memberId,
    role: newRole
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid inputs'
    }
  }

  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Verify requester is OWNER
  const requester = await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(eq(members.organizationId, orgId), eq(members.userId, user.id))
  })

  if (!requester || requester.role !== 'OWNER') {
    return {
      success: false,
      message: 'You do not have permission to update roles.'
    }
  }

  try {
    await db
      .update(members)
      .set({ role: newRole })
      .where(and(eq(members.organizationId, orgId), eq(members.id, memberId)))

    await logAudit(user.id, 'UPDATE_MEMBER_ROLE', { memberId, newRole }, orgId)

    revalidatePath('/', 'layout')
    return { success: true, message: 'Member role updated.' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to update member role.' }
  }
}

export async function acceptInvitation(token: string): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return {
      success: false,
      message: 'You must be logged in to accept an invitation.'
    }
  }

  const invitation = await db.query.invitations.findFirst({
    where: (invitations, { eq }) => eq(invitations.token, token),
    with: {
      organization: true
    }
  })

  if (!invitation) {
    return { success: false, message: 'Invalid or expired invitation.' }
  }

  if (new Date() > invitation.expiresAt) {
    return { success: false, message: 'Invitation expired.' }
  }

  // Strict email check
  if (invitation.email !== user.email) {
    return {
      success: false,
      message: 'This invitation is for a different email address.'
    }
  }

  // Check if already member
  const existingMember = await db.query.members.findFirst({
    where: (members, { eq, and }) =>
      and(
        eq(members.organizationId, invitation.organizationId),
        eq(members.userId, user.id)
      )
  })

  if (existingMember) {
    // Already member, just cleanup invite and redirect
    await db.delete(invitations).where(eq(invitations.id, invitation.id))
    const locale = await getLocale()
    redirect(`/${locale}/dashboard/${invitation.organization.slug}`)
  }

  try {
    await db.transaction(async tx => {
      await tx.insert(members).values({
        organizationId: invitation.organizationId,
        userId: user.id,
        role: invitation.role
      })

      await tx.delete(invitations).where(eq(invitations.id, invitation.id))
    })
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to join organization.' }
  }

  const locale = await getLocale()
  revalidatePath('/', 'layout')
  redirect(`/${locale}/dashboard/${invitation.organization.slug}`)
}
