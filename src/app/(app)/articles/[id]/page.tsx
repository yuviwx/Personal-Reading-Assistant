"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, ExternalLink, Tag } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getArticleById, updateArticle } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      const foundArticle = getArticleById(id);
      setArticle(foundArticle);
    }
  }, [id]);

  const handleToggleReadStatus = () => {
    if (id && article) {
      const newStatus = !article.isRead;
      const updatedArticle = updateArticle(id, { isRead: newStatus });
      if (updatedArticle) {
        setArticle(updatedArticle);
        toast({
          title: `Marked as ${newStatus ? 'Read' : 'Unread'}`,
          description: newStatus 
            ? `"${updatedArticle.headline || 'Article'}" won't be suggested again.`
            : `"${updatedArticle.headline || 'Article'}" will now appear in suggestions.`,
        });
      }
    }
  };
  
  if (article === undefined) {
    return (
      <div className="container py-8 max-w-3xl mx-auto">
         <div className="mb-4">
            <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter className="flex justify-between mt-4">
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-10 w-36" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (article === null) {
    return (
      <div className="container py-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold">Article Not Found</h1>
        <p className="text-muted-foreground mt-2">This article could not be found in your local storage.</p>
        <Button asChild className="mt-4">
          <Link href="/get">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suggestions
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{article.headline || 'Untitled Article'}</CardTitle>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
            {article.topic && (
              <div className="flex items-center">
                <Tag className="mr-1.5 h-4 w-4" />
                <Badge variant="outline">{article.topic}</Badge>
              </div>
            )}
            {article.estimatedTime && (
              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4" />
                <span>{article.estimatedTime} minute read</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground/80 leading-relaxed">{article.summary || 'No summary available.'}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <Button asChild variant="secondary">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Original Article
            </a>
          </Button>
          <Button onClick={handleToggleReadStatus} className={!article.isRead ? 'bg-accent hover:bg-accent/90' : ''}>
            <CheckCircle className="mr-2 h-4 w-4" />
            {article.isRead ? 'Mark as Unread' : 'Mark as Read'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
