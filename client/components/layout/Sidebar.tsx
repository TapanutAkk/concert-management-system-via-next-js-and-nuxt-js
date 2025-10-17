'use client';

import Link from 'next/link';
import { Home, Inbox, RefreshCcw, LogOut } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const navItems = [
  { name: 'Home', href: '/admin', icon: Home },
  { name: 'History', href: '/admin/history', icon: Inbox }
];

export default function Sidebar() {
  const { role, setRole } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.includes('/admin') && typeof setRole === 'function') {
      setRole('admin');
      localStorage.setItem('role', 'admin');
    } else if (pathname.includes('/user') && typeof setRole === 'function') {
      setRole('user');
      localStorage.setItem('role', 'user');
    }
  }, [pathname, setRole]);

  return (
    <div className="flex flex-col w-64 min-h-screen bg-white">
      {role === 'admin' && (
        <div className="p-6 text-2xl font-semibold">
          Admin
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-2">
        {role === 'admin' && (
          navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200" 
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))
        )}

        <Link
          key={`Switch to ${role === 'admin' ? 'User' : 'Admin'}`}
          href={`/${role === 'admin' ? 'user' : 'admin'}`}
          onClick={() => setRole(role === 'admin' ? 'user' : 'admin')}
          className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200" 
        >
          <RefreshCcw className="w-5 h-5" />
          <span>Switch to {role === 'admin' ? 'User' : 'Admin'}</span>
        </Link>
      </nav>

      <div className="px-4 py-4">
          <Link
            key='LogOut'
            href=''
            className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200" 
          >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}