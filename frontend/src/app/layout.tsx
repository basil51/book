'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuthContext } from '../context/AuthContext';
import './globals.css';
import {
  Calendar,
  User,
  Menu,
  X,
  Search,
  Building2,
  Phone,
  Mail,
  ChevronDown,
  LogOut,
  Settings,
  Calendar as CalendarIcon,
  UserCircle,
  LayoutDashboard,
} from 'lucide-react';
import { getDashboardUrl, isNonClientUser } from '@/lib/role-utils';
import { SocialIcon } from 'react-social-icons'

// Separate component for auth buttons to use useAuthContext
function AuthButtons() {
  const { user, logout, isAuthenticated } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <User className="h-4 w-4 mr-2" />
          Login
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center">
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserCircle className="h-5 w-5 mr-2" />
          <span>{user?.name}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                Welcome, {user?.name}
              </div>
              
              {/* My Dashboard - Only show for non-client users */}
              {user?.role && isNonClientUser(user.role) && (
                <Link
                  href={getDashboardUrl(user.role)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  My Dashboard
                </Link>
              )}
              
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <UserCircle className="h-4 w-4 mr-2" />
                Profile
              </Link>
              <Link
                href="/appointments"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                My Appointments
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                role="menuitem"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile auth buttons component
function MobileAuthButtons() {
  const { user, logout, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center px-4 space-x-4">
        <Link
          href="/login"
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <User className="h-4 w-4 mr-2" />
          Login
        </Link>
        <Link
          href="/register"
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-3 border-t border-gray-200">
      <div className="px-4">
        <div className="text-base font-medium text-gray-800">Welcome, {user?.name}</div>
        <div className="mt-3 space-y-1">
          <Link
            href="/profile"
            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            href="/appointments"
            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            My Appointments
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            Settings
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  {/* Logo and Primary Nav */}
                  <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2 -ml-2">
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <span className="text-xl font-bold text-gray-900">BookEase</span>
                    </Link>
                    <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                      <Link
                        href="/"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActive('/')
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        Home
                      </Link>
                      <Link
                        href="/businesses"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActive('/businesses')
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        Businesses
                      </Link>
                      <Link
                        href="/services"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActive('/services')
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        Services
                      </Link>
                      <Link
                        href="/about"
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActive('/about')
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        About
                      </Link>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                    <div className="max-w-lg w-full lg:max-w-xs">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Search businesses or services"
                          type="search"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Auth Buttons */}
                  <AuthButtons />

                  {/* Mobile menu button */}
                  <div className="flex items-center sm:hidden">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    >
                      {isMenuOpen ? (
                        <X className="block h-6 w-6" />
                      ) : (
                        <Menu className="block h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile menu */}
              {isMenuOpen && (
                <div className="sm:hidden">
                  <div className="pt-2 pb-3 space-y-1">
                    <Link
                      href="/"
                      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                        isActive('/')
                          ? 'border-blue-500 text-blue-700 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      href="/businesses"
                      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                        isActive('/businesses')
                          ? 'border-blue-500 text-blue-700 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Businesses
                    </Link>
                    <Link
                      href="/services"
                      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                        isActive('/services')
                          ? 'border-blue-500 text-blue-700 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      Services
                    </Link>
                    <Link
                      href="/about"
                      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                        isActive('/about')
                          ? 'border-blue-500 text-blue-700 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      About
                    </Link>
                  </div>
                  <MobileAuthButtons />
                </div>
              )}
            </nav>

            {/* Main Content */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Company Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-8 w-8 text-blue-500" />
                      <span className="text-xl font-bold">BookEase</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Making appointment booking simple and efficient for businesses and customers.
                    </p>
                    <div className="flex space-x-4">
                        <SocialIcon network="facebook" className="h-6 w-6"/>
                        <SocialIcon network="twitter" className="h-6 w-6"/>
                        <SocialIcon network="instagram" className="h-6 w-6"/>      
                        <SocialIcon network="youtube" className="h-6 w-6"/>  
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Quick Links
                    </h3>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <Link href="/businesses" className="text-gray-300 hover:text-white">
                          Find Businesses
                        </Link>
                      </li>
                      <li>
                        <Link href="/services" className="text-gray-300 hover:text-white">
                          Browse Services
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="text-gray-300 hover:text-white">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-gray-300 hover:text-white">
                          Contact
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* For Businesses */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      For Businesses
                    </h3>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <Link href="/business/register" className="text-gray-300 hover:text-white">
                          Register Business
                        </Link>
                      </li>
                      <li>
                        <Link href="/business/login" className="text-gray-300 hover:text-white">
                          Business Login
                        </Link>
                      </li>
                      <li>
                        <Link href="/pricing" className="text-gray-300 hover:text-white">
                          Pricing
                        </Link>
                      </li>
                      <li>
                        <Link href="/features" className="text-gray-300 hover:text-white">
                          Features
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Contact Us
                    </h3>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-center space-x-2 text-gray-300">
                        <Phone className="h-5 w-5" />
                        <span>+972 (51) 5622-300</span>
                      </li>
                      <li className="flex items-center space-x-2 text-gray-300">
                        <Mail className="h-5 w-5" />
                        <span>support@sparkco.vip</span>
                      </li>
                      <li className="flex items-center space-x-2 text-gray-300">
                        <Building2 className="h-5 w-5" />
                        <span>Jerusalem, 97200</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <p className="text-gray-400 text-sm text-center">
                    © {new Date().getFullYear()} BookEase. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
