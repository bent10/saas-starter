'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { signUp, signInWithGoogle } from '../actions/auth-actions'
import { signUpSchema } from '../schemas'
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
import Link from 'next/link'
import { toast } from 'sonner'

export function SignUpForm() {
  const t = useTranslations('Auth')
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: ''
    }
  })

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    startTransition(async () => {
      const result = await signUp(data)
      if (result?.error) {
        toast.error(result.error)
      } else {
        setIsSuccess(true)
        toast.success('Account created successfully!')
      }
    })
  }

  const onGoogleSignIn = () => {
    startTransition(async () => {
      await signInWithGoogle()
    })
  }

  if (isSuccess) {
    return (
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We have sent you a verification link to complete your registration.
          </CardDescription>
        </CardHeader>
        <CardFooter className='flex justify-center'>
          <Link
            href='/login'
            className='text-primary hover:underline font-medium'
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>{t('register_title')}</CardTitle>
        <CardDescription>{t('register_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password_label')}</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='******' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {t('register_button')}
            </Button>
          </form>
        </Form>
        <div className='relative my-4'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant='outline'
          type='button'
          className='w-full'
          onClick={onGoogleSignIn}
          disabled={isPending}
        >
          Google
        </Button>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <div className='text-sm text-muted-foreground'>
          {t('already_have_account')}{' '}
          <Link
            href='/login'
            className='text-primary hover:underline font-medium'
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
