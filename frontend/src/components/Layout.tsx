// src/app/AppShell.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/book/example-business', label: 'Book' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    ...(user?.role === 'admin' ? [{ href: '/admin/bookings', label: 'Admin' }] : []),
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">SparkCo</Link>
          <nav className="hidden md:flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-blue-600 ${pathname === link.href ? 'text-blue-600' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            {isAuthenticated ? (
              <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
                Logout
              </button>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
                Login
              </Link>
            )}
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block ${pathname === link.href ? 'text-blue-600' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <div>
              {isAuthenticated ? (
                <button onClick={logout} className="w-full text-left px-4 py-2 bg-red-500 text-white rounded">
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SparkCo. All rights reserved.
        </div>
      </footer>
    </>
  );
}