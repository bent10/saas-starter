'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { db } from '@/shared/lib/db/drizzle'
import { invitations, members, organizations } from '@/shared/lib/db/schema'
import { inviteMemberSchema, acceptInvitationSchema } from '../schemas'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { Resend } from 'resend'
import InviteEmail from '../emails/invite-email'
import { redirect } from 'next/navigation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function createInvitation(
  data: z.infer<typeof inviteMemberSchema>
) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const validation = inviteMemberSchema.safeParse(data)
  if (!validation.success) {
    return { error: 'Invalid data' }
  }

  const { email, role, organizationId } = validation.data

  const member = await db.query.members.findFirst({
    where: and(
      eq(members.organizationId, organizationId),
      eq(members.userId, user.id)
    )
  })

  if (!member || member.role !== 'OWNER') {
    return { error: 'Insufficient permissions' }
  }

  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const [invitation] = await db
    .insert(invitations)
    .values({
      organizationId,
      email,
      role,
      token,
      expiresAt,
      inviterId: user.id,
      status: 'PENDING'
    })
    .returning()

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, organizationId)
  })

  if (org) {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `Join ${org.name} on SaaS Starter`,
        react: InviteEmail({
          teamName: org.name,
          inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`,
          invitedByEmail: user.email || undefined
        })
      })
    } catch (e) {
      console.error('Failed to send email:', e)
    }
  }

  return { success: true, invitationId: invitation.id }
}

export async function acceptInvitation(
  data: z.infer<typeof acceptInvitationSchema>
) {
  const { token, method, password } = data

  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.token, token)
  })

  if (
    !invitation ||
    invitation.status !== 'PENDING' ||
    new Date() > invitation.expiresAt
  ) {
    return { error: 'Invalid or expired invitation' }
  }

  if (method === 'google') {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?invite_token=${token}`
      }
    })
    if (error) return { error: error.message }
    if (authData.url) redirect(authData.url)
    return { success: true }
  } else if (method === 'password') {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password: password!
    })

    if (authError) return { error: authError.message }

    if (authData.user) {
      await db.insert(members).values({
        organizationId: invitation.organizationId,
        userId: authData.user.id,
        role: invitation.role
      })

      await db
        .update(invitations)
        .set({ status: 'ACCEPTED' })
        .where(eq(invitations.id, invitation.id))

      return { success: true }
    }
  }

  return { error: 'Invalid method' }
}
