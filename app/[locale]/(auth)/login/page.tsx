import { SignInForm } from '@/features/auth/components/sign-in-form'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Auth' })

  return {
    title: t('login_title')
  }
}

export default function LoginPage() {
  return <SignInForm />
}
