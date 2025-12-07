"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, BookOpen, Eye, EyeOff, Trash2, Sparkles, Loader2 } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getArticles, updateArticle, deleteArticle, getUniqueTopics, saveArticles } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { unifyTopicsAction } from '@/app/actions';

export default function AllArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isUnifying, setIsUnifying] = useState(false);
  const { toast } = useToast();

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

  const handleDeleteArticle = (articleId: string) => {
    deleteArticle(articleId);
    setArticles(prevArticles => prevArticles.filter(a => a.id !== articleId));
    toast({
        title: "Article Deleted",
        description: "The article has been removed from your library.",
    })
  };

  const handleUnifyTopics = async () => {
    const topics = getUniqueTopics();
    if (topics.length < 2) {
        toast({
            title: "Not enough topics",
            description: "You need at least two different topics to unify them.",
        });
        return;
    }
    
    setIsUnifying(true);
    const result = await unifyTopicsAction({ topics });
    setIsUnifying(false);

    if (result.success && result.data) {
        const topicMap = result.data;
        const allArticles = getArticles();
        let updatedCount = 0;

        const updatedArticles = allArticles.map(article => {
            const oldTopic = article.topic || 'General';
            const newTopic = topicMap[oldTopic];
            if (newTopic && newTopic !== oldTopic) {
                updatedCount++;
                return { ...article, topic: newTopic };
            }
            return article;
        });

        if (updatedCount > 0) {
            saveArticles(updatedArticles);
            setArticles(updatedArticles);
            toast({
                title: "Topics Unified!",
                description: `${updatedCount} article(s) were updated with new topics.`,
            });
        } else {
             toast({
                title: "No changes",
                description: "The AI didn't find any topics to unify.",
            });
        }

    } else {
        toast({
            variant: "destructive",
            title: "Unification Failed",
            description: result.error || 'Could not unify topics at this time.',
        });
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
            <div className="flex justify-between items-start">
                <div>
                  <CardTitle>All Articles ({articles.length})</CardTitle>
                  <CardDescription>A complete list of all your saved articles, both read and unread.</CardDescription>
                </div>
                <Button
                    variant="outline"
                    onClick={handleUnifyTopics}
                    disabled={isUnifying || articles.length < 2}
                >
                    {isUnifying ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Unify Topics
                </Button>
            </div>
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
                  <TableHead className="text-center pr-12">Actions</TableHead>
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
                      <TableCell className="flex justify-center items-center space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/articles/${article.id}`}>
                            <BookOpen className="h-4 w-4"/>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the article
                                from your local storage.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteArticle(article.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
