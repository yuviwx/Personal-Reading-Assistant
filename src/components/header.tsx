import { Logo } from './logo';
import { Button } from './ui/button';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild>
            <Link href="/add">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Article
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/get">
              <Search className="mr-2 h-4 w-4" /> Get Article
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
