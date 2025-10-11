import Link from 'next/link';
import { Home, Inbox, RefreshCcw, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/admin', icon: Home },
  { name: 'History', href: '/admin/history', icon: Inbox },
  { name: 'Switch to user', href: '/user', icon: RefreshCcw },
];

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 min-h-screen bg-white">
      <div className="p-6 text-2xl font-semibold">
        Admin
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200" 
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
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