'use client'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { createClient } from '@/shared/lib/supabase/client'
import { useState } from 'react'
import { toast } from 'sonner'

export function UserProfileForm({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const fullName = formData.get('fullName') as string

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Profile updated')
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-w-md'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' value={user.email} disabled />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='fullName'>Full Name</Label>
        <Input
          id='fullName'
          name='fullName'
          defaultValue={user.user_metadata?.full_name || ''}
          placeholder='John Doe'
        />
      </div>
      <Button type='submit' disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Update Profile'}
      </Button>
    </form>
  )
}
