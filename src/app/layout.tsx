import type {Metadata} from 'next';
import {Toaster} from '@/components/ui/toaster';
import './globals.css';
import { Heebo } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Personal Reading Assistant',
  description: 'Save articles and videos for offline reading.',
  manifest: '/manifest.json',
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Personal Reading Assistant",
  },
};

export const viewport = {
  themeColor: "#0E7AFE",
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
    <html lang="en">
      <head>
        {/* PWA fallback tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0E7AFE" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <body className={`${heebo.variable} font-body antialiased min-h-screen bg-background`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
