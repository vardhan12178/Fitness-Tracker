'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/auth';
import { getGoal } from '@/lib/firestore';
import { Activity, ShieldCheck, BarChart3 } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const user = await signInWithGoogle();
      
      // Check if user has set a goal (with fallback)
      try {
        const goal = await getGoal(user.uid);
        if (goal) {
          router.push('/dashboard');
        } else {
          router.push('/goal-setup');
        }
      } catch (firestoreError) {
        // If Firestore fails, just send to goal-setup (they'll set it up there)
        console.warn('Could not check for existing goal:', firestoreError);
        router.push('/goal-setup');
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      
      if (error.code === 'auth/operation-not-allowed') {
        setError('❌ Google sign-in is not enabled in Firebase Console. Please enable it in Authentication → Sign-in method → Google.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Add localhost to authorized domains in Firebase Console.');
      } else {
        setError(`Failed to sign in: ${error.code || error.message}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] relative overflow-hidden px-4 py-10">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />

      <div className="relative max-w-5xl mx-auto min-h-[calc(100vh-5rem)] flex items-center">
        <div className="w-full grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="hidden lg:flex flex-col justify-center bg-[#111827]/70 border border-gray-800 rounded-3xl p-10 backdrop-blur-sm">
            <Link href="/" className="text-3xl font-bold text-white">
              <span className="text-orange-500">Fit</span>Track
            </Link>
            <h1 className="text-3xl font-bold text-white mt-6 leading-tight">
              Track smarter.
              <br />
              Stay consistent.
            </h1>
            <p className="text-gray-400 mt-4 text-sm leading-6">
              Log meals, workouts, sleep, and steps in one place and instantly see if you&apos;re on pace for your fitness goal.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-300">
                <Activity className="w-4 h-4 text-orange-500" />
                Guided daily check-ins with trend tracking
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Weekly insights and on-track status
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Secure cloud sync with Google sign-in
              </div>
            </div>
          </div>

          <div className="w-full max-w-md lg:max-w-none mx-auto lg:mx-0 flex items-center">
            <div className="w-full bg-[#111827]/90 border border-gray-800 rounded-3xl p-7 sm:p-8 backdrop-blur-sm shadow-2xl shadow-black/20">
              <div className="text-center mb-7">
                <Link href="/" className="text-3xl font-bold text-orange-500 lg:hidden">FitTrack</Link>
                <h2 className="text-2xl font-bold text-white mt-3 lg:mt-0">Welcome back</h2>
                <p className="text-gray-400 mt-2 text-sm">Sign in to continue your fitness journey</p>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 py-3.5 px-4 rounded-xl font-semibold transition border border-gray-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="mt-6 text-center text-xs text-gray-500">
                Protected by Firebase Authentication.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
