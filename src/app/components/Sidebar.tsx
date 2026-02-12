'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import {
  LayoutDashboard,
  Target,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import { useGoal } from '../../../context/GoalContext';
import { useRouter } from 'next/navigation';
import { deleteUserData } from '@/lib/firestore';
import ConfirmResetModal from './ConfirmResetModal';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Goals', icon: Target, href: '/goal-setup' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useUser();
  const { setGoal } = useGoal();
  const router = useRouter();
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      if (user) {
        await deleteUserData(user.uid);
      }
      await setGoal(null);
      router.push('/goal-setup');
    } finally {
      setIsResetting(false);
      setShowReset(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside className="hidden lg:flex w-64 h-screen bg-[#111827] border-r border-gray-800 fixed left-0 top-0 z-40 flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          <span className="text-orange-500">Fit</span>Track
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={() => setShowReset(true)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition w-full"
        >
          <RotateCcw className="w-5 h-5" />
          Reset Data
        </button>
      </nav>

      <ConfirmResetModal
        open={showReset}
        isBusy={isResetting}
        onConfirm={handleReset}
        onCancel={() => setShowReset(false)}
      />

      <div className="px-3 py-4 border-t border-gray-800">
        {user && (
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
