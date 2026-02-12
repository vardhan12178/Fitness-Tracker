'use client';

import { useUser } from '../../../context/UserContext';
import { useRouter } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useGoal } from '../../../context/GoalContext';
import { LayoutDashboard, Target, RotateCcw } from 'lucide-react';
import { deleteUserData } from '@/lib/firestore';
import ConfirmResetModal from './ConfirmResetModal';

export default function Navbar() {
  const { user, logout } = useUser();
  const { setGoal } = useGoal();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

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

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-[#030712]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="flex justify-between items-center px-4 md:px-6 lg:px-8 py-3.5">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo */}
          <Link href="/dashboard" className="lg:hidden text-lg font-bold text-white">
            <span className="text-orange-500">Fit</span>Track
          </Link>

          {/* Desktop: empty left spacer */}
          <div className="hidden lg:block" />

          {/* Right section */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
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
                <span className="text-sm text-gray-300 font-medium">{user.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-[#111827] border-r border-gray-800 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-xl font-bold text-white">
                <span className="text-orange-500">Fit</span>Track
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <nav className="space-y-1 flex-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                href="/goal-setup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition"
              >
                <Target className="w-5 h-5" />
                Goals
              </Link>
              <button
                onClick={() => { setShowReset(true); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition w-full"
              >
                <RotateCcw className="w-5 h-5" />
                Reset Data
              </button>
            </nav>

            {user && (
              <div className="border-t border-gray-800 pt-4">
                <div className="flex items-center gap-3 px-4 py-2">
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
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmResetModal
        open={showReset}
        isBusy={isResetting}
        onConfirm={handleReset}
        onCancel={() => setShowReset(false)}
      />
    </>
  );
}
