import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FitTrack — Your Personal Fitness Dashboard',
  description:
    'Track workouts, meals, sleep, and fitness goals. A modern fitness tracking dashboard built with Next.js.',
  keywords: ['fitness', 'tracker', 'workout', 'meal tracker', 'sleep tracker', 'dashboard'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
