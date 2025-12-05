import { BookOpen } from 'lucide-react';

export function MainLogo() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
      <BookOpen className="h-10 w-10" />
    </div>
  );
}
