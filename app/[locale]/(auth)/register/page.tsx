import { SignUpForm } from '@/features/auth/components/sign-up-form';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth' });
 
  return {
    title: t('register_title')
  };
}

export default function RegisterPage() {
  return <SignUpForm />;
}
