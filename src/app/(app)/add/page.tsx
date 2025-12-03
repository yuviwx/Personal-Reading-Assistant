"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BrainCircuit, Loader2, Save } from 'lucide-react';

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
import { addArticle } from '@/lib/storage';
import { generateMetadataAction } from '@/app/actions';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  headline: z.string().optional(),
  topic: z.string().optional(),
  estimatedTime: z.coerce.number().int().positive().optional(),
  summary: z.string().optional(),
});

export default function AddArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      headline: '',
      topic: '',
      summary: '',
    },
  });

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
    addArticle(values);
    toast({
      title: 'Article Saved!',
      description: 'Your article has been saved locally.',
    });
    router.push('/get');
  }

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Add New Article</CardTitle>
              <CardDescription>
                Manually enter article details or use AI to generate them from a URL.
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
                      Optional Details
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
                Save Article
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
