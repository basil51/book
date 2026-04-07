'use client'

import { Button } from '@/components/ui/button'
import { LogOut, User as UserIcon, Menu, LayoutDashboard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { getDashboardUrl, isNonClientUser } from '@/lib/role-utils'

export function BusinessAdminHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5" />
                <span className="hidden md:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* My Dashboard - Only show for non-client users */}
              {user?.role && isNonClientUser(user.role) && (
                <DropdownMenuItem asChild>
                  <Link href={getDashboardUrl(user.role)} className="w-full">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    My Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => {
                  logout()
                  window.location.href = '/login'
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}