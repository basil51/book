'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Calendar,
  Settings,
  Tag,
  Users,
  Bell,
  Building2,
  ClipboardList,
  LineChart,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Services',
    items: [
      {
        title: 'Service List',
        href: '/admin/services/list',
        icon: ClipboardList,
        description: 'Manage your service offerings',
      },
      {
        title: 'Service Analytics',
        href: '/admin/services/analytics',
        icon: LineChart,
        description: 'Track service performance',
      },
    ],
  },
  {
    title: 'Appointments',
    items: [
      {
        title: 'Calendar',
        href: '/admin/appointments/calendar',
        icon: Calendar,
        description: 'View and manage appointments',
      },
      {
        title: 'Settings',
        href: '/admin/appointments/settings',
        icon: Settings,
        description: 'Configure appointment rules',
      },
    ],
  },
  {
    title: 'Business',
    items: [
      {
        title: 'Staff',
        href: '/admin/staff',
        icon: Users,
        description: 'Manage staff members',
      },
      {
        title: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
        description: 'Configure notifications',
      },
      {
        title: 'Business Profile',
        href: '/admin/profile',
        icon: Building2,
        description: 'Manage business details',
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        title: 'Overview',
        href: '/admin/analytics',
        icon: BarChart,
        description: 'Business performance overview',
      },
      {
        title: 'Revenue',
        href: '/admin/analytics/revenue',
        icon: DollarSign,
        description: 'Track revenue and growth',
      },
      {
        title: 'Customer Insights',
        href: '/admin/analytics/customers',
        icon: Users,
        description: 'Customer behavior and trends',
      },
    ],
  },
];

export function BusinessMenu() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold">Business</span>
        </div>
        
        <nav className="space-y-6">
          {menuItems.map((section) => (
            <div key={section.title}>
              <h3 className="px-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-3 px-2 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon className={cn(
                        'h-5 w-5',
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      )} />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

// Quick stats component for the dashboard
export function BusinessQuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">$24,500</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
        <div className="mt-2 flex items-center text-sm text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>+12.5% from last month</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Appointments</p>
            <p className="text-2xl font-bold">156</p>
          </div>
          <Calendar className="h-8 w-8 text-blue-500" />
        </div>
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>23 upcoming today</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Services</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <Tag className="h-8 w-8 text-purple-500" />
        </div>
        <div className="mt-2 flex items-center text-sm text-purple-600">
          <Star className="h-4 w-4 mr-1" />
          <span>4.8 average rating</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Staff Members</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <Users className="h-8 w-8 text-orange-500" />
        </div>
        <div className="mt-2 flex items-center text-sm text-orange-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span>92% availability</span>
        </div>
      </div>
    </div>
  );
} 