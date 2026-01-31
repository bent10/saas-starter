'use client'

import { useTransition, use } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptInvitation } from '@/features/org/actions/invitation-actions'
import { acceptInvitationSchema } from '@/features/org/schemas'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function InvitePage({
  params
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof acceptInvitationSchema>>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      token,
      method: 'password',
      password: ''
    }
  })

  const onGoogleAccept = () => {
    startTransition(async () => {
      await acceptInvitation({ token, method: 'google' })
    })
  }

  const onSubmit = (data: z.infer<typeof acceptInvitationSchema>) => {
    startTransition(async () => {
      const result = await acceptInvitation(data)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Invitation accepted')
        router.push('/dashboard')
      }
    })
  }

  return (
    <div className='container flex items-center justify-center min-h-screen py-8'>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            You have been invited to join an organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <Button
              variant='outline'
              type='button'
              className='w-full'
              onClick={onGoogleAccept}
              disabled={isPending}
            >
              Accept with Google
            </Button>

            <div className='relative my-4'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or set a password
                </span>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='******'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full' disabled={isPending}>
                  {isPending && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Accept & Create Account
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
