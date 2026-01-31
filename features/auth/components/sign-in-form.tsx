'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { signIn, signInWithGoogle } from '../actions/auth-actions'
import { signInSchema } from '../schemas'
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

export function SignInForm() {
  const t = useTranslations('Auth')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    startTransition(async () => {
      const result = await signIn(data)
      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  const onGoogleSignIn = () => {
    startTransition(async () => {
      await signInWithGoogle()
    })
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>{t('login_title')}</CardTitle>
        <CardDescription>{t('login_subtitle')}</CardDescription>
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
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>{t('password_label')}</FormLabel>
                    <Link
                      href='/forgot-password'
                      className='text-sm font-medium text-primary hover:underline'
                    >
                      {t('forgot_password')}
                    </Link>
                  </div>
                  <FormControl>
                    <Input type='password' placeholder='******' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {t('login_button')}
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
          {t('dont_have_account')}{' '}
          <Link
            href='/register'
            className='text-primary hover:underline font-medium'
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
