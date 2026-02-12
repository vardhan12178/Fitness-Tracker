'use client';

import { ReactNode } from 'react';
import { UserProvider } from '../../context/UserContext';
import { GoalProvider } from '../../context/GoalContext';
import { AppShell } from './components/AppShell';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <GoalProvider>
        <AppShell>{children}</AppShell>
      </GoalProvider>
    </UserProvider>
  );
}
