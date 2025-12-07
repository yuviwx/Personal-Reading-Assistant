'use server';

/**
 * @fileOverview This file defines a Genkit flow for unifying similar topics.
 *
 * @exported unifyTopics - An async function that calls the flow.
 */

import {ai} from '@/ai/genkit';
import {
  UnifyTopicsInput,
  UnifyTopicsInputSchema,
  UnifyTopicsOutput,
  UnifyTopicsOutputSchema,
} from './unify-topics-types';

export async function unifyTopics(input: UnifyTopicsInput): Promise<UnifyTopicsOutput> {
  return unifyTopicsFlow(input);
}

const unifyTopicsPrompt = ai.definePrompt({
  name: 'unifyTopicsPrompt',
  input: {schema: UnifyTopicsInputSchema},
  output: {schema: UnifyTopicsOutputSchema},
  prompt: `You are an AI assistant that helps organize article topics. Given a list of topics, your task is to unify similar or related topics into a single, more general topic.

  For example, if you are given the topics: "AI", "Artificial Intelligence", "Machine Learning", "Tech", "Technology", a good unification would be:
  {
    "AI": "Artificial Intelligence",
    "Artificial Intelligence": "Artificial Intelligence",
    "Machine Learning": "Artificial Intelligence",
    "Tech": "Technology",
    "Technology": "Technology"
  }

  Only unify topics that are very similar. If a topic is unique, it should map to itself. Return a JSON object where keys are the original topics and values are the new, unified topics.

  Topics to unify: {{#each topics}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}
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
