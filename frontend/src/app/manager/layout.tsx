'use client';
//src/app/manager/layout.tsx
import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  Settings,
  Menu,
  X,
  LogOut,
  Search,
  ChevronDown,
  Home,
  Clock,
  Bell,
  CreditCard,
  Scissors,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      href: '/manager',
      icon: LayoutDashboard,
    },
    {
      name: 'Appointments',
      href: '/manager/appointments',
      icon: Calendar,
      badge: '12',
      children: [
        { name: 'Calendar View', href: '/manager/appointments/calendar', icon: Calendar },
        { name: 'Appointment List', href: '/manager/appointments/list', icon: Calendar },
        { name: 'Settings', href: '/manager/appointments/settings', icon: Settings },
      ],
    },
    {
      name: 'Staff',
      href: '/manager/staff',
      icon: Users,
      children: [
        { name: 'Staff List', href: '/manager/staff/list', icon: Users },
        { name: 'Schedule', href: '/manager/staff/schedule', icon: Clock },
        { name: 'Performance', href: '/manager/staff/performance', icon: UserCircle },
      ],
    },
    {
      name: 'Clients',
      href: '/manager/clients',
      icon: UserCircle,
      children: [
        { name: 'Client List', href: '/manager/clients/list', icon: UserCircle },
        { name: 'Client History', href: '/manager/clients/history', icon: UserCircle },
        { name: 'Communications', href: '/manager/clients/communications', icon: Bell },
      ],
    },
    {
      name: 'Services',
      href: '/manager/services',
      icon: Scissors,
      children: [
        { name: 'Service List', href: '/manager/services/list', icon: Scissors },
        { name: 'Categories', href: '/manager/services/categories', icon: Scissors },
        { name: 'Pricing', href: '/manager/services/pricing', icon: CreditCard },
      ],
    },
    {
      name: 'Business',
      href: '/manager/business',
      icon: Building2,
      children: [
        { name: 'Profile', href: '/manager/business/profile', icon: Building2 },
        { name: 'Working Hours', href: '/manager/business/hours', icon: Clock },
        { name: 'Notifications', href: '/manager/business/notifications', icon: Bell },
        { name: 'Payments', href: '/manager/business/payments', icon: CreditCard },
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
    if (href === '/manager') {
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
            <p className="text-xs text-gray-500">Business Admin</p>
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
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
                className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Business Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@business.com'}</p>
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
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          {sidebarOpen && (
            <>
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
                <SidebarContent />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:min-h-screen">
        {/* Desktop Sidebar */}
        <div className="lg:w-64 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <div className="flex flex-col h-full border-r border-gray-200 bg-white">
              <SidebarContent />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-14 bg-white border-b border-gray-200 lg:hidden">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1 flex justify-between px-4">
              <div className="flex-1 flex">
                <div className="w-full flex md:ml-0">
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5" />
                    </div>
                    <input
                      className="block w-full pl-10 pr-3 py-1.5 border border-transparent rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 