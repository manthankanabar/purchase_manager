'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideShoppingCart, LucideUsers, LucideBuilding, LucideClipboardList, LucideSettings, LucideMapPin, LucidePackage } from 'lucide-react';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LucideClipboardList },
  { name: 'Entities', href: '/dashboard/entities', icon: LucideBuilding },
  { name: 'Sites', href: '/dashboard/sites', icon: LucideMapPin },
  { name: 'Vendors', href: '/dashboard/vendors', icon: LucideUsers },
  { name: 'Stock Items', href: '/dashboard/stock-items', icon: LucidePackage },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Purchase Manager</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-lg font-semibold">Multi-Entity Purchase Management</h2>
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
