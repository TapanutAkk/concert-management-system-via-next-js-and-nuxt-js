import Link from 'next/link';
import { Home, History, Users, LogOut, ArrowLeftRight } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/admin', icon: Home },
  { name: 'History', href: '/admin/history', icon: History },
  { name: 'Switch to user', href: '/user', icon: ArrowLeftRight },
];

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6 text-2xl font-semibold border-b border-gray-700">
        Admin
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 
                       text-gray-200 hover:text-white" 
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <button 
          className="flex items-center space-x-3 p-3 w-full rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}