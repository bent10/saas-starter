'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { signUpSchema, signInSchema, forgotPasswordSchema, updatePasswordSchema } from '../schemas';
import { logAudit } from '@/shared/lib/audit';

export type AuthState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function signUp(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid inputs',
    };
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();
  const locale = await getLocale();
  
  const origin = process.env.NEXT_PUBLIC_APP_URL || '';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/${locale}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Check your email to confirm your account.',
  };
}

export async function signIn(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid inputs',
    };
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (user) {
    await logAudit(user.id, 'SIGN_IN', { email });
  }

  const locale = await getLocale();
  revalidatePath('/', 'layout');
  redirect(`/${locale}/dashboard`);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const locale = await getLocale();
  revalidatePath('/', 'layout');
  redirect(`/${locale}/login`);
}

export async function forgotPassword(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid email',
    };
  }

  const { email } = validatedFields.data;
  const supabase = await createClient();
  const locale = await getLocale();
  const origin = process.env.NEXT_PUBLIC_APP_URL || '';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/${locale}/auth/update-password`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Check your email for the password reset link.',
  };
}

export async function updatePassword(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid passwords',
    };
  }

  const { password } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const locale = await getLocale();
  revalidatePath('/', 'layout');
  redirect(`/${locale}/dashboard`);
}

export async function signInWithProvider(provider: 'google' | 'github'): Promise<void> {
  const supabase = await createClient();
  const locale = await getLocale();
  const origin = process.env.NEXT_PUBLIC_APP_URL || '';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/${locale}/auth/callback`,
    },
  });

  if (error) {
    console.error('OAuth error:', error);
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  }
}
