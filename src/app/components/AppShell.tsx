'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/goal-setup');

  if (!isProtectedRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      <div className="flex flex-col flex-1 lg:ml-64">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 mt-16">{children}</main>
      </div>
    </div>
  );
}
