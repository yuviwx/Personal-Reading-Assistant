import type {Metadata} from 'next';
import {Toaster} from '@/components/ui/toaster';
import './globals.css';
import { Heebo } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Personal Reading Assistant',
  description: 'Save articles and videos for offline reading.',
  manifest: '/manifest.json',
};

const heebo = Heebo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heebo.variable} font-body antialiased min-h-screen bg-background`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
