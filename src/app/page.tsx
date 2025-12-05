import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, BookOpen, Library, Menu } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { MainLogo } from '@/components/main-logo';

const NavLink = ({
  href,
  title,
  subtitle,
  icon: Icon,
  className,
  iconBgClass,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  className?: string;
  iconBgClass?: string;
}) => (
  <Link href={href} className="block w-full">
    <Card
      className={`group flex items-center justify-between p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${className}`}
    >
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm opacity-70">{subtitle}</p>
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgClass}`}
      >
        <Icon className="h-6 w-6" />
      </div>
    </Card>
  </Link>
);

export default function Home() {
  return (
    <>
      <header className="fixed top-0 left-0 p-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-card rounded-full shadow-md">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="mt-8 flex flex-col gap-4">
              <SheetClose asChild>
                <Link
                  href="/add"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Plus className="h-5 w-5" />
                  Add Article
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/get"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <BookOpen className="h-5 w-5" />
                  Get Article
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/all-articles"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Library className="h-5 w-5" />
                  All Articles
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <div className="flex w-full max-w-md flex-col items-center space-y-8 text-center">
          <MainLogo />
          <h1 className="text-4xl font-bold tracking-tight">Reading List</h1>
          <p className="text-lg text-foreground/70 -mt-6">
            Your offline article library
          </p>

          <div className="w-full space-y-4">
            <NavLink
              href="/add"
              title="Add Article"
              subtitle="Save a new URL to read later"
              icon={Plus}
              className="bg-primary text-primary-foreground"
              iconBgClass="bg-primary-foreground/10"
            />
            <NavLink
              href="/get"
              title="Get Article"
              subtitle="Find something to read now"
              icon={BookOpen}
              className="bg-card text-card-foreground"
              iconBgClass="bg-secondary"
            />
            <NavLink
              href="/all-articles"
              title="Library"
              subtitle="View all saved articles"
              icon={Library}
              className="bg-card text-card-foreground !p-4 !flex-row"
              iconBgClass="bg-secondary !h-10 !w-10"
            />
          </div>

          <p className="text-sm text-foreground/50 pt-4">
            Works fully offline
          </p>
        </div>
      </main>
    </>
  );
}
