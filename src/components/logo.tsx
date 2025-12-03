import { BookMarked } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary group">
      <BookMarked className="h-7 w-7 transition-transform group-hover:scale-110" />
      <span className="text-2xl font-bold tracking-tight font-headline">
        Offline Article Saver
      </span>
    </Link>
  );
}
