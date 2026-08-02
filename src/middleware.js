
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { verifyAccessTokenEdge as verifyAccessToken } from '@/lib/jwtEdge';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  const locales = routing.locales;
  const pathSegments = pathname.split('/').filter(Boolean);

  let locale = routing.defaultLocale;
  let normalizedPath = pathname;

  if (pathSegments.length > 0 && locales.includes(pathSegments[0])) {
    locale = pathSegments[0];
    normalizedPath = '/' + pathSegments.slice(1).join('/');
  }

  const isAdminRoute = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/');
  const isDashboardRoute = normalizedPath === '/dashboard' || normalizedPath.startsWith('/dashboard/');

  if (isAdminRoute || isDashboardRoute) {
    let token = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    if (!token) {
      token = request.cookies.get('fmk_access_token')?.value ||
              request.cookies.get('accessToken')?.value ||
              request.cookies.get('token')?.value;
    }

    const authUser = token ? verifyAccessToken(token) : null;

    if (!authUser) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute) {
      const allowedAdminRoles = ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'];
      if (!allowedAdminRoles.includes(authUser.role)) {
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(az|en|ru)/:path*', '/admin', '/admin/:path*', '/dashboard', '/dashboard/:path*']
};

