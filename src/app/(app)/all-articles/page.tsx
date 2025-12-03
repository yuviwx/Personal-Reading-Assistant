"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, BookOpen, Eye, EyeOff } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getArticles, updateArticle } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AllArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // This runs only on the client
    const allArticles = getArticles();
    setArticles(allArticles);
  }, []);

  const handleToggleReadStatus = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    const updatedArticle = updateArticle(articleId, { isRead: !article.isRead });
    if (updatedArticle) {
      setArticles(prevArticles => 
        prevArticles.map(a => a.id === articleId ? updatedArticle : a)
      );
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Full Article Library</h1>
        <Button asChild variant="outline">
          <Link href="/get">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suggestions
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Articles ({articles.length})</CardTitle>
          <CardDescription>A complete list of all your saved articles, both read and unread.</CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead className="max-w-[300px]">Headline</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Time (min)</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.length > 0 ? (
                  articles.map(article => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <button onClick={() => handleToggleReadStatus(article.id)}>
                              {article.isRead ? (
                                <Badge variant="secondary" className="flex items-center gap-1.5 cursor-pointer"><EyeOff className="h-3.5 w-3.5" /> Read</Badge>
                              ) : (
                                <Badge variant="default" className="flex items-center gap-1.5 cursor-pointer"><Eye className="h-3.5 w-3.5" /> Unread</Badge>
                              )}
                             </button>
                          </TooltipTrigger>
                           <TooltipContent>
                            <p>Click to mark as {article.isRead ? "'unread'" : "'read'"}.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="font-medium truncate max-w-[300px]">{article.headline || 'Untitled'}</TableCell>
                      <TableCell>{article.topic ? <Badge variant="outline">{article.topic}</Badge> : 'N/A'}</TableCell>
                      <TableCell>{article.estimatedTime || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(article.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/articles/${article.id}`}>
                            <BookOpen className="mr-2 h-4 w-4"/>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No articles found. <Link href="/add" className="text-primary underline">Add one!</Link>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
