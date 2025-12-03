'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating article metadata from a URL.
 *
 * The flow takes a URL as input and returns a headline, topic, estimated reading time, and summary.
 *
 * @exported generateArticleMetadata - An async function that calls the flow.
 * @exported GenerateArticleMetadataInput - The input type for the generateArticleMetadata function.
 * @exported GenerateArticleMetadataOutput - The return type for the generateArticleMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArticleMetadataInputSchema = z.object({
  url: z.string().url().describe('The URL of the article.'),
});
export type GenerateArticleMetadataInput = z.infer<typeof GenerateArticleMetadataInputSchema>;

const GenerateArticleMetadataOutputSchema = z.object({
  headline: z.string().describe('The headline of the article.'),
  topic: z.string().describe('The topic of the article.'),
  estimatedReadingTime: z.number().describe('The estimated reading time of the article in minutes.'),
  summary: z.string().describe('A one-line summary of the article.'),
});
export type GenerateArticleMetadataOutput = z.infer<typeof GenerateArticleMetadataOutputSchema>;

export async function generateArticleMetadata(input: GenerateArticleMetadataInput): Promise<GenerateArticleMetadataOutput> {
  return generateArticleMetadataFlow(input);
}

const generateArticleMetadataPrompt = ai.definePrompt({
  name: 'generateArticleMetadataPrompt',
  input: {schema: GenerateArticleMetadataInputSchema},
  output: {schema: GenerateArticleMetadataOutputSchema},
  prompt: `You are an AI article metadata generator.  Given a URL to an article, you will generate a headline, topic, estimated reading time (in minutes), and a one-line summary.

  URL: {{{url}}}
  `,
});

const generateArticleMetadataFlow = ai.defineFlow(
  {
    name: 'generateArticleMetadataFlow',
    inputSchema: GenerateArticleMetadataInputSchema,
    outputSchema: GenerateArticleMetadataOutputSchema,
  },
  async input => {
    const {output} = await generateArticleMetadataPrompt(input);
    return output!;
  }
);
