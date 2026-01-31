import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Extract locale from next param or default to en
  const segments = next.split('/')
  const locale = ['en', 'id'].includes(segments[1]) ? segments[1] : 'en'

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/${locale}/login?error=auth_code_error`)
}
