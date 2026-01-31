'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { resetPassword } from '../actions/auth-actions'
import { forgotPasswordSchema } from '../schemas'
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
  CardTitle,
  CardFooter
} from '@/shared/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Link } from '@/shared/lib/navigation'
import { toast } from 'sonner'

export function ForgotPasswordForm() {
  const t = useTranslations('Auth')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      const result = await resetPassword(data)
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success) {
        toast.success(result.message)
      }
    })
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>{t('forgot_password')}</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder='m@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Send Reset Link
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <Link
          href='/login'
          className='text-sm text-primary hover:underline font-medium'
        >
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  )
}
