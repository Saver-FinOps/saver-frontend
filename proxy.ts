import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['en', 'es'] as const;

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/es', request.url), 308);
  }

  if (!hasLocalePrefix(pathname)) {
    return NextResponse.redirect(new URL(`/es${pathname}`, request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|ingest|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
