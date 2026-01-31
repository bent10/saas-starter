'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { db } from '@/shared/lib/db/drizzle'
import { profiles } from '@/shared/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function banUser(userId: string) {
  // In a real app, ensure the current user is a super-admin
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }
  // Check admin role here...

  try {
    await db
      .update(profiles)
      .set({ status: 'BANNED' })
      .where(eq(profiles.id, userId))

    // Optionally invalidate sessions via Supabase Admin API (requires service key)

    return { success: true }
  } catch {
    return { error: 'Failed to ban user' }
  }
}
