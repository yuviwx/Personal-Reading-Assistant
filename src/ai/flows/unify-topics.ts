'use server';

/**
 * @fileOverview This file defines a Genkit flow for unifying similar topics.
 *
 * @exported unifyTopics - An async function that calls the flow.
 * @exported UnifyTopicsInput - The input type for the unifyTopics function.
 * @exported UnifyTopicsOutput - The return type for the unifyTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const UnifyTopicsInputSchema = z.object({
  topics: z.array(z.string()).describe('A list of topics to unify.'),
});
export type UnifyTopicsInput = z.infer<typeof UnifyTopicsInputSchema>;

export const UnifyTopicsOutputSchema = z.record(z.string()).describe('A map of old topics to new, unified topics. The key is the old topic, and the value is the new unified topic. If a topic is not changed, the value should be the same as the key.');
export type UnifyTopicsOutput = z.infer<typeof UnifyTopicsOutputSchema>;

export async function unifyTopics(input: UnifyTopicsInput): Promise<UnifyTopicsOutput> {
  return unifyTopicsFlow(input);
}

const unifyTopicsPrompt = ai.definePrompt({
  name: 'unifyTopicsPrompt',
  input: {schema: UnifyTopicsInputSchema},
  output: {schema: UnifyTopicsOutputSchema},
  prompt: `You are an AI assistant that helps organize article topics. Given a list of topics, your task is to unify similar or related topics into a single, more general topic.

  For example, if you are given the topics: ["AI", "Artificial Intelligence", "Machine Learning", "Tech", "Technology"], a good unification would be:
  {
    "AI": "Artificial Intelligence",
    "Artificial Intelligence": "Artificial Intelligence",
    "Machine Learning": "Artificial Intelligence",
    "Tech": "Technology",
    "Technology": "Technology"
  }

  Only unify topics that are very similar. If a topic is unique, it should map to itself. Return a JSON object where keys are the original topics and values are the new, unified topics.

  Topics to unify: {{{jsonStringify topics}}}
  `,
});

const unifyTopicsFlow = ai.defineFlow(
  {
    name: 'unifyTopicsFlow',
    inputSchema: UnifyTopicsInputSchema,
    outputSchema: UnifyTopicsOutputSchema,
  },
  async input => {
    if (input.topics.length < 2) {
      // Not enough topics to unify, return a map to itself
      const result: UnifyTopicsOutput = {};
      input.topics.forEach(topic => {
        result[topic] = topic;
      });
      return result;
    }
    const {output} = await unifyTopicsPrompt(input);
    return output!;
  }
);
