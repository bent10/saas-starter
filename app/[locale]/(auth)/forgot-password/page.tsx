import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Auth' })

  return {
    title: t('forgot_password')
  }
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
