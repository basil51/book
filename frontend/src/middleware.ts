//src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@my-app/shared';

// List of protected routes (can be extended)
const protectedRoutes = ['/admin'];

// Routes that require admin role
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // If no token and trying to access protected route, redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has token and trying to access admin route, verify admin role
  if (isAdminRoute && token) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const user = await response.json();
      
      // If user is not an admin, redirect to their role-specific dashboard
      if (user.role !== UserRole.ADMIN) {
        const redirectPath = getRoleRedirect(user.role);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    } catch (error) {
      // If there's an error fetching user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Helper function to get role-specific redirect path
function getRoleRedirect(role: UserRole): string {
  switch (role) {
    case UserRole.MANAGER:
      return '/manager';
    case UserRole.OWNER:
      return '/owner';
    case UserRole.STAFF:
      return '/staff';
    case UserRole.CLIENT:
      return '/client';
    default:
      return '/';
  }
}

//  export const config = {  matcher: ['/admin/:path*'],} // protect all routes under /admin;

export const config = {
  matcher: ['/admin/:path*', '/dashboard'],
};