'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Building2, 
  Users, 
  UserCheck,
  Calendar,
  CreditCard,
  Bell,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Search,
  ChevronDown,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import { getDashboardUrl, isNonClientUser } from '@/lib/role-utils';

type IconComponent = React.ComponentType<{ className?: string }>;

interface MenuItem {
  name: string;
  href: string;
  icon: IconComponent;
  badge?: string;
  children?: MenuItem[];
}

interface ManagerLayoutProps {
  children: React.ReactNode;
}

const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthContext();

  // Redirect to /login if not authenticated
  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Business Management',
      href: '/admin/businesses',
      icon: Building2,
      children: [
        { name: 'All Businesses', href: '/admin/businesses', icon: Building2 },
        { name: 'Add Business', href: '/admin/businesses/create', icon: Building2 },
        { name: 'Business Reports', href: '/admin/businesses/reports', icon: BarChart3 },
      ],
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      children: [
        { name: 'All Users', href: '/admin/users', icon: Users },
        { name: 'Add User', href: '/admin/users/create', icon: Users },
        { name: 'User Roles', href: '/admin/users/roles', icon: UserCheck },
      ],
    },
    {
      name: 'Business Admins',
      href: '/admin/admins',
      icon: UserCheck,
      children: [
        { name: 'All Admins', href: '/admin/admins', icon: UserCheck },
        { name: 'Assign Admin', href: '/admin/admins/assign', icon: UserCheck },
      ],
    },
    {
      name: 'Appointments',
      href: '/admin/appointments',
      icon: Calendar,
      badge: '45',
      children: [
        { name: 'All Appointments', href: '/admin/appointments', icon: Calendar },
        { name: 'Calendar View', href: '/admin/appointments/calendar', icon: Calendar },
        { name: 'Appointment Analytics', href: '/admin/appointments/analytics', icon: BarChart3 },
      ],
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: CreditCard,
      children: [
        { name: 'All Transactions', href: '/admin/payments', icon: CreditCard },
        { name: 'Failed Payments', href: '/admin/payments/failed', icon: CreditCard },
        { name: 'Revenue Reports', href: '/admin/payments/reports', icon: BarChart3 },
      ],
    },
    {
      name: 'Notifications',
      href: '/admin/notifications',
      icon: Bell,
      badge: '3',
      children: [
        { name: 'Notification Center', href: '/admin/notifications', icon: Bell },
        { name: 'Send Notifications', href: '/admin/notifications/send', icon: Bell },
        { name: 'Templates', href: '/admin/notifications/templates', icon: Bell },
      ],
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      children: [
        { name: 'Business Performance', href: '/admin/analytics/business', icon: BarChart3 },
        { name: 'User Activity', href: '/admin/analytics/users', icon: BarChart3 },
        { name: 'Revenue Analytics', href: '/admin/analytics/revenue', icon: BarChart3 },
        { name: 'Custom Reports', href: '/admin/analytics/custom', icon: BarChart3 },
      ],
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      children: [
        { name: 'System Settings', href: '/admin/settings', icon: Settings },
        { name: 'Notification Settings', href: '/admin/settings/notifications', icon: Settings },
        { name: 'Payment Settings', href: '/admin/settings/payments', icon: Settings },
      ],
    },
  ];

  const toggleExpanded = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isExpanded = (menuName: string) => expandedMenus.includes(menuName);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">AppointPro</h2>
            <p className="text-xs text-gray-500">Manager Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isExpanded(item.name) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isExpanded(item.name) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive(child.href)
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        {/* My Dashboard - Only show for non-client users */}
        {user?.role && isNonClientUser(user.role) && (
          <Link 
            href={getDashboardUrl(user.role)}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>My Dashboard</span>
          </Link>
        )}
        
        <button 
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72 bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-72 h-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="p-6 overflow-y-auto flex-1 bg-gray-50 h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;