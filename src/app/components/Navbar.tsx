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
      <nav className="w-full glass-panel !rounded-2xl transition-all duration-300 shadow-2xl">
        <div className="flex justify-between items-center px-4 md:px-6 lg:px-8 py-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-muted hover:text-foreground transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo */}
          <Link href="/dashboard" className="lg:hidden text-lg font-black text-white flex items-center gap-2 tracking-tighter">
            <div className="w-6 h-6 rounded-md bg-gradient-sunset flex items-center justify-center shadow-md shadow-orange-500/40">
              <LayoutDashboard className="w-3 h-3 text-white" />
            </div>
            FitTrack
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
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-muted font-medium">{user.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden font-sans">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu panel */}
          <div className="fixed left-2 top-2 bottom-2 w-72 glass-panel p-4 flex flex-col">
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-xl font-bold text-foreground flex items-center gap-2 tracking-tighter">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                  <LayoutDashboard className="w-3 h-3 text-white" />
                </div>
                FitTrack
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted hover:text-foreground text-xl"
              >
                &times;
              </button>
            </div>

            <nav className="space-y-1 flex-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 transition"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                href="/goal-setup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 transition"
              >
                <Target className="w-5 h-5" />
                Goals
              </Link>
              <button
                onClick={() => { setShowReset(true); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 transition w-full"
              >
                <RotateCcw className="w-5 h-5" />
                Reset Data
              </button>
            </nav>

            {user && (
              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center gap-3 px-4 py-2">
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
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
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
