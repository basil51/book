'use client'

import Link from 'next/link'
import { LayoutDashboard, Calendar, Users, Settings, BookUser } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Bookings',
    href: '/admin/bookings',
    icon: Calendar,
  },
  {
    name: 'Staff',
    href: '/admin/staff',
    icon: Users,
  },
  {
    name: 'Services',
    href: '/admin/services',
    icon: BookUser,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function BusinessAdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-primary">Business Admin</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <item.icon className="flex-shrink-0 w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}