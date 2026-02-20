'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isProtectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/goal-setup');

  if (!isProtectedRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-orange-500/10 blur-[140px] mix-blend-screen animate-pulse"
          style={{ animationDuration: '12s' }}
        />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-purple-600/10 blur-[150px] mix-blend-screen" />
      </div>

      {/* Sidebar — in-flow flex-shrink-0 column */}
      <Sidebar />

      {/* Right panel — flex column, full height, no overflow here */}
      <div className="relative z-10 flex flex-col flex-1 min-w-0 h-screen">

        {/* Header zone — never scrolls, always visible */}
        <div className="flex-none px-4 pt-4 pb-0">
          <Navbar />
        </div>

        {/* Scrollable content zone */}
        <div className="flex-1 overflow-y-auto">
          <main className="p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
