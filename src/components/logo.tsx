import { BookMarked } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary group">
      <div className="p-2 bg-primary text-primary-foreground rounded-lg">
        <BookMarked className="h-5 w-5 transition-transform group-hover:scale-110" />
      </div>
      <span className="text-xl font-bold tracking-tight font-headline">
        Reading List
      </span>
    </Link>
  );
}
