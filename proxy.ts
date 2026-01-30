import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/shared/lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en'],
  defaultLocale: 'en'
});

export default async function middleware(request: NextRequest) {
  const { response: supabaseResponse, user } = await updateSession(request);

  const path = request.nextUrl.pathname;
  
  // Basic route protection logic
  // Adjust regex to match your locale pattern and protected routes
  const isProtected = /\/(dashboard|create-org|account)/.test(path);
  const isAuthPage = /\/(login|register)/.test(path);

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    // Default to 'en' if not present, but usually intlMiddleware handles this.
    // For redirect, we'll force /en/login for now or respect current locale.
    url.pathname = '/en/login'; 
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/en/dashboard';
    return NextResponse.redirect(url);
  }

  const response = intlMiddleware(request);

  // Copy Supabase cookies to the final response
  if (supabaseResponse.headers.has('set-cookie')) {
    response.headers.set('set-cookie', supabaseResponse.headers.get('set-cookie')!);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};