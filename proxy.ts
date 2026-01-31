import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/shared/lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/shared/lib/navigation';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { response: supabaseResponse, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Extract locale from path
  const pathSegments = path.split('/');
  const firstSegment = pathSegments[1];
  const validLocale = routing.locales.includes(firstSegment as any) ? firstSegment : routing.defaultLocale;

  // Basic route protection logic
  const isProtected = /\/(dashboard|create-org|account)/.test(path);
  const isAuthPage = /\/(login|register|forgot-password|reset-password)/.test(path);
  const isVerifyPage = /\/verify/.test(path);

  if (user) {
      // Check for Banned Status
      const { data: profile } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', user.id)
          .single();
      
      if (profile?.status === 'BANNED') {
          // Allow access to a banned page or force logout?
          // For now, let's redirect to a banned page if not already there, 
          // or return 403.
          // Since we don't have a /banned page in tasks, we'll redirect to a generic error or logout.
          // But logout needs an action.
          // We can redirect to /login?error=banned
          if (!path.includes('/login')) {
             const url = request.nextUrl.clone();
             url.pathname = `/${validLocale}/login`;
             url.searchParams.set('error', 'banned');
             // We should probably sign them out, but we can't easily do that in middleware 
             // without clearing cookies manually which updateSession does partially.
             return NextResponse.redirect(url);
          }
      }

      // Check for MFA
      const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (mfaData && mfaData.nextLevel === 'aal2' && mfaData.currentLevel === 'aal1') {
          if (!isVerifyPage) {
              const url = request.nextUrl.clone();
              url.pathname = `/${validLocale}/verify`;
              return NextResponse.redirect(url);
          }
      }
  }

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${validLocale}/login`; 
    return NextResponse.redirect(url);
  }

  if ((isAuthPage || isVerifyPage) && user) {
     // If user is AAL2 (verified) or doesn't need MFA, redirect to dashboard from auth pages
     // But if they are on /verify and NEED MFA, let them stay (handled above).
     // If they are on /verify and DON'T need MFA, redirect to dashboard.
      const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      const needsMFA = mfaData?.nextLevel === 'aal2' && mfaData?.currentLevel === 'aal1';

      if (!needsMFA) {
        const url = request.nextUrl.clone();
        url.pathname = `/${validLocale}/dashboard`;
        return NextResponse.redirect(url);
      }
  }

  const response = intlMiddleware(request);

  // Copy Supabase cookies to the final response
  if (supabaseResponse.headers.has('set-cookie')) {
    response.headers.set('set-cookie', supabaseResponse.headers.get('set-cookie')!);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\..*).*)']
};
