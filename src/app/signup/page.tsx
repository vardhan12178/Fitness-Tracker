'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login since Google OAuth handles both signup and login
    router.replace('/login');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#030712]">
      <div className="text-gray-400">Redirecting to sign in...</div>
    </main>
  );
}
