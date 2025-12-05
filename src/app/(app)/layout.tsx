import { Header } from '@/components/header';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Button asChild className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg" size="icon">
        <Link href="/">
          <Home className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
      </Button>
    </div>
  );
}
