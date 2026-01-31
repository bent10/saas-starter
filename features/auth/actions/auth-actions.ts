'use server'

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { db } from "@/shared/lib/db/drizzle";
import { profiles } from "@/shared/lib/db/schema";
import { signUpSchema, signInSchema, updatePasswordSchema, resetPasswordSchema } from "../schemas";
import { z } from "zod";

export async function signUp(data: z.infer<typeof signUpSchema>) {
  const supabase = await createClient();
  const validation = signUpSchema.safeParse(data);

  if (!validation.success) {
    return { error: "Invalid data" };
  }

  const { email, password, fullName } = validation.data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (authData.user) {
    try {
        await db.insert(profiles).values({
            id: authData.user.id,
            email: email,
            username: email.split('@')[0] + '_' + Math.random().toString(36).substring(7),
            fullName: fullName,
        });
    } catch (e) {
        console.error("Failed to create profile:", e);
    }
  }

  return { success: true };
}

export async function signIn(data: z.infer<typeof signInSchema>) {
  const supabase = await createClient();
  const validation = signInSchema.safeParse(data);

  if (!validation.success) {
    return { error: "Invalid data" };
  }

  const { email, password } = validation.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    redirect("/login?error=oauth");
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(data: z.infer<typeof resetPasswordSchema>) {
    const supabase = await createClient();
    const validation = resetPasswordSchema.safeParse(data);

    if (!validation.success) {
        return { error: "Invalid email" };
    }

    const { email } = validation.data;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?next=/account/update-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, message: "Password reset email sent" };
}

export async function updatePassword(data: z.infer<typeof updatePasswordSchema>) {
    const supabase = await createClient();
    const validation = updatePasswordSchema.safeParse(data);

    if (!validation.success) {
        return { error: "Invalid password" };
    }

    const { password } = validation.data;

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}