'use client'

import { useState, useTransition } from 'react'
import { enrollMFA, verifyMFA } from '../actions/mfa-actions'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/shared/components/ui/alert'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export function MFASetup() {
  const [step, setStep] = useState<'init' | 'verify'>('init')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const onEnroll = () => {
    startTransition(async () => {
      const result = await enrollMFA()
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else if (result.qr && result.id) {
        setQrCode(result.qr)
        setFactorId(result.id)
        setStep('verify')
      }
    })
  }

  const onVerify = () => {
    if (!factorId) return
    startTransition(async () => {
      const result = await verifyMFA(factorId, code)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'MFA Enabled Successfully' })
        setStep('init')
        setQrCode(null)
      }
    })
  }

  return (
    <div className='space-y-4'>
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertTitle>
            {message.type === 'error' ? 'Error' : 'Success'}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {step === 'init' && (
        <Button onClick={onEnroll} disabled={isPending}>
          {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Setup 2FA
        </Button>
      )}

      {step === 'verify' && qrCode && (
        <div className='space-y-4'>
          <div className='flex justify-center'>
            <Image src={qrCode} alt='QR Code' width={200} height={200} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='code'>Enter Code</Label>
            <Input
              id='code'
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder='123456'
              maxLength={6}
            />
          </div>
          <Button
            onClick={onVerify}
            disabled={isPending || code.length !== 6}
            className='w-full'
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Verify & Enable
          </Button>
        </div>
      )}
    </div>
  )
}
