"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BrainCircuit, Loader2, Save, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getArticleById, updateArticle } from '@/lib/storage';
import { generateMetadataAction } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import type { Article } from '@/lib/types';


const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  headline: z.string().optional(),
  topic: z.string().optional(),
  estimatedTime: z.coerce.number().int().positive().optional(),
  summary: z.string().optional(),
});

export default function EditArticlePage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      headline: '',
      topic: '',
      summary: '',
      estimatedTime: undefined,
    },
  });

  useEffect(() => {
    if (id) {
      const foundArticle = getArticleById(id);
      setArticle(foundArticle);
      if (foundArticle) {
        form.reset({
          url: foundArticle.url,
          headline: foundArticle.headline,
          topic: foundArticle.topic,
          summary: foundArticle.summary,
          estimatedTime: foundArticle.estimatedTime,
        });
      }
    }
  }, [id, form]);

  const handleGenerate = async () => {
    const url = form.getValues('url');
    if (!url) {
      form.trigger('url');
      return;
    }

    setIsGenerating(true);
    const result = await generateMetadataAction({ url });
    setIsGenerating(false);

    if (result.success && result.data) {
      form.setValue('headline', result.data.headline);
      form.setValue('topic', result.data.topic);
      form.setValue('estimatedTime', result.data.estimatedReadingTime);
      form.setValue('summary', result.data.summary);
      toast({
        title: 'Success!',
        description: 'Article metadata has been generated.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error || 'Could not generate metadata from the URL.',
      });
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;
    updateArticle(id, values);
    toast({
      title: 'Article Saved!',
      description: 'Your article has been updated.',
    });
    router.push('/all-articles');
  }

  if (article === undefined) {
    return (
       <div className="container py-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
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
        <Button asChild className="mt-4" variant="outline">
          <Link href="/all-articles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Edit Article</CardTitle>
              <CardDescription>
                Update article details or use AI to regenerate them from a URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/article" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Article Details
                    </span>
                  </div>
                </div>

              <div className="space-y-4">
                 <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Future of Web Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="estimatedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Reading Time (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-line Summary</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief, one-line summary of the article." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                Generate with AI
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
