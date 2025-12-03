"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Tag, Search, XCircle, Library, BrainCircuit, Loader2 } from 'lucide-react';
import type { Article } from '@/lib/types';
import { getArticles, getUniqueTopics, updateArticle } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { generateMetadataAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function GetArticlePage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [suggestedArticles, setSuggestedArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [availableTime, setAvailableTime] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState<string | null>(null);
  const { toast } = useToast();


  useEffect(() => {
    // This runs only on the client
    const articles = getArticles();
    const uniqueTopics = getUniqueTopics();
    setAllArticles(articles);
    setTopics(uniqueTopics);
  }, []);
  
  const unreadArticles = useMemo(() => allArticles.filter(a => !a.isRead), [allArticles]);

  const handleSearch = () => {
    let filtered = unreadArticles;

    if (selectedTopic && selectedTopic !== 'all') {
      filtered = filtered.filter(article => article.topic === selectedTopic);
    }
    if (availableTime) {
      const time = parseInt(availableTime, 10);
      if (!isNaN(time)) {
        filtered = filtered.filter(article => article.estimatedTime && article.estimatedTime <= time);
      }
    }
    
    setSuggestedArticles(filtered);
    setHasSearched(true);
  };
  
  const clearFilters = () => {
    setSelectedTopic('all');
    setAvailableTime('');
    setSuggestedArticles([]);
    setHasSearched(false);
  }

  const handleGenerateDetails = async (article: Article) => {
    if (!article.url) return;

    setIsGeneratingId(article.id);
    const result = await generateMetadataAction({ url: article.url });
    
    if (result.success && result.data) {
      const updated = updateArticle(article.id, {
        headline: result.data.headline,
        topic: result.data.topic,
        estimatedTime: result.data.estimatedReadingTime,
        summary: result.data.summary,
      });

      if (updated) {
        setAllArticles(prev => prev.map(a => a.id === article.id ? updated : a));
        toast({
          title: 'Details Generated!',
          description: `Successfully updated "${updated.headline}".`,
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error || 'Could not generate details for this article.',
      });
    }
    setIsGeneratingId(null);
  }

  const articlesToShow = hasSearched ? suggestedArticles : unreadArticles;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Find a new read</CardTitle>
              <CardDescription>Filter your unread articles to find the perfect one.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {topics.map(topic => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max reading time (mins)</label>
                <Input
                  type="number"
                  placeholder="e.g., 15"
                  value={availableTime}
                  onChange={e => setAvailableTime(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2 items-stretch">
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Find Article
              </Button>
              {(hasSearched || selectedTopic !== 'all' || availableTime) && (
                 <Button variant="ghost" onClick={clearFilters}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Clear Filters
                </Button>
              )}
               <Button variant="secondary" asChild>
                  <Link href="/all-articles">
                    <Library className="mr-2 h-4 w-4" />
                    View Full Library
                  </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 font-headline">
            {hasSearched ? 'Suggestions' : 'All Unread Articles'} ({articlesToShow.length})
          </h2>

          <div className="space-y-4">
            {articlesToShow.length > 0 ? (
              articlesToShow.map(article => {
                const hasMissingDetails = !article.headline || !article.topic || !article.summary || !article.estimatedTime;
                const isGenerating = isGeneratingId === article.id;

                return (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg font-headline">{article.headline || 'Untitled Article'}</CardTitle>
                         <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
                            {article.topic && article.topic !== 'General' ? (
                              <div className="flex items-center">
                                <Tag className="mr-1 h-4 w-4" />
                                <Badge variant="secondary">{article.topic}</Badge>
                              </div>
                            ) : null}
                            {article.estimatedTime ? (
                              <div className="flex items-center">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>{article.estimatedTime} min read</span>
                              </div>
                            ) : null}
                          </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/80 line-clamp-2">{article.summary || 'No summary available.'}</p>
                      </CardContent>
                       <CardFooter className="flex gap-2">
                        <Button asChild variant="default" size="sm">
                          <Link href={`/articles/${article.id}`}>
                            <BookOpen className="mr-2 h-4 w-4"/>
                            Read Article
                          </Link>
                        </Button>
                        {hasMissingDetails && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateDetails(article)}
                            disabled={isGenerating}
                          >
                             {isGenerating ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <BrainCircuit className="mr-2 h-4 w-4" />
                            )}
                            Auto-fill with AI
                          </Button>
                        )}
                      </CardFooter>
                  </Card>
                )
              })
            ) : (
              <Card className="text-center py-12 border-dashed">
                 <CardContent className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold">No Articles Found</h3>
                    <p className="text-muted-foreground mt-2 max-w-xs">
                      { hasSearched ? 'Try adjusting your filters or ' : ''}
                      you can always {' '}
                      <Link href="/add" className="text-primary underline hover:text-primary/80">add a new article</Link>.
                    </p>
                 </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
