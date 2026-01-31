'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/shared/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function VerifyMfaPage() {
  const [code, setCode] = useState('')
  const [isPending, startTransition] = useTransition()
  // const router = useRouter();
  // const searchParams = useSearchParams();

  // In a real flow, these IDs might come from the session or URL params
  // Supabase Auth MFA challenge returns a challenge ID and factor ID usually needed.
  // However, if we are in "assurance level 1" (password verified) but need level 2,
  // we can list factors and challenge them.

  // For this prototype, we'll assume we need to handle the verification logic
  // likely initiated by the middleware redirecting here.

  // Note: Implementing the full login-with-MFA flow requires more state management
  // (knowing which factor to challenge).

  const onVerify = () => {
    // Placeholder: In a real app, you'd fetch the user's factors,
    // challenge one, and then verify with this code.
    startTransition(async () => {
      // await verifyMFA(...)
      toast.info('MFA Verification logic requires factor ID context.')
    })
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the code from your authenticator app.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Input
            placeholder='123456'
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={6}
          />
          <Button
            onClick={onVerify}
            className='w-full'
            disabled={isPending || code.length !== 6}
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Verify
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
