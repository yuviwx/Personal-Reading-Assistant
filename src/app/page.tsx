import {Button} from '@/components/ui/button';
import {FileText, PlusCircle} from 'lucide-react';
import Link from 'next/link';
import {Logo} from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-8 text-center">
        <Logo />
        <p className="max-w-xl text-lg text-foreground/80">
          Your personal corner of the internet, saved for later. Add articles,
          generate summaries with AI, and find the perfect read for your spare
          moments—all available offline.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/add">
              <PlusCircle className="mr-2" />
              Add New Article
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/get">
              <FileText className="mr-2" />
              Get Article Suggestion
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
