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
    <>
      <aside className="hidden lg:flex w-72 flex-shrink-0 h-screen sticky top-0 overflow-y-auto z-40 flex-col p-4 gap-0">
        {/* Inner glass panel */}
        <div className="glass-panel flex flex-col flex-1 overflow-hidden">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-white/5">
            <Link href="/dashboard" className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-sunset flex items-center justify-center shadow-lg shadow-orange-500/40">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              FitTrack
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive
                    ? 'bg-gradient-sunset text-white font-bold shadow-lg shadow-orange-500/25 scale-[1.02]'
                    : 'text-muted hover:text-white hover:bg-white/5 font-medium border border-transparent hover:border-white/5'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 w-full mt-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Data
            </button>
          </nav>



          <div className="px-3 py-4 border-t border-white/5">
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 mb-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-white/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-white/50 truncate font-medium">{user.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Render modal outside aside to avoid backdrop-filter stacking context */}
      <ConfirmResetModal
        open={showReset}
        isBusy={isResetting}
        onConfirm={handleReset}
        onCancel={() => setShowReset(false)}
      />
    </>);
}
