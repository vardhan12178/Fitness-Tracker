'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/auth';
import { getGoal } from '@/lib/firestore';
import { Activity } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const user = await signInWithGoogle();

      try {
        const goal = await getGoal(user.uid);
        if (goal) {
          router.push('/dashboard');
        } else {
          router.push('/goal-setup');
        }
      } catch (firestoreError) {
        console.warn('Could not check for existing goal:', firestoreError);
        router.push('/goal-setup');
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);

      if (error.code === 'auth/operation-not-allowed') {
        setError('❌ Google sign-in is not enabled. Enable it in Firebase Console.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups.');
      } else {
        setError(`Failed to sign in: ${error.code || error.message}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative flex flex-col items-center justify-center overflow-hidden p-6 font-sans">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[0%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-orange-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-[-10%] right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-700/20 blur-[140px] mix-blend-screen" />
      </div>

      {/* Floating Logo */}
      <Link href="/" className="relative z-10 flex items-center gap-3 mb-12 transform hover:scale-105 transition-transform">
        <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center shadow-xl shadow-orange-500/50">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <span className="text-3xl font-extrabold tracking-tighter text-white drop-shadow-lg">
          FitTrack
        </span>
      </Link>

      {/* Glass Login Panel */}
      <div className="relative z-10 glass-panel w-full max-w-md p-10 md:p-12 text-center shadow-2xl shadow-black/70 group">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-b from-white/[0.02] to-transparent duration-500" />

        <h1 className="text-3xl font-black text-white tracking-tight mb-3">
          Welcome back
        </h1>
        <p className="text-white/60 font-medium mb-10">
          Enter the new standard of fitness tracking.
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-100 text-black py-4 px-6 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/10"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? 'Authenticating...' : 'Continue with Google'}
        </button>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-sm px-4 py-3 rounded-xl backdrop-blur-md">
            {error}
          </div>
        )}

        <div className="mt-10 text-xs font-medium text-white/30 uppercase tracking-widest">
          Secured by Firebase
        </div>
      </div>
    </main>
  );
}
