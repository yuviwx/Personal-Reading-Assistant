
"use client";

import { useState } from 'react';
import { Logo } from './logo';
import { Button } from './ui/button';
import Link from 'next/link';
import { PlusCircle, Search, Menu, BookMarked } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetClose } from './ui/sheet';

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden flex-1 items-center justify-end space-x-2 md:flex">
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
        </nav>

        {/* Mobile Nav */}
        <div className="flex items-center justify-end md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <Logo />
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                <SheetClose asChild>
                  <Link href="/add" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <PlusCircle className="h-5 w-5" />
                    Add Article
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/get" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Search className="h-5 w-5" />
                    Get Article
                  </Link>
                </SheetClose>
                 <SheetClose asChild>
                  <Link href="/all-articles" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <BookMarked className="h-5 w-5" />
                    All Articles
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
