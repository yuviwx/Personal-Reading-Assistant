import {z} from 'genkit';

export const UnifyTopicsInputSchema = z.object({
  topics: z.array(z.string()).describe('A list of topics to unify.'),
});
export type UnifyTopicsInput = z.infer<typeof UnifyTopicsInputSchema>;

export const UnifyTopicsOutputSchema = z
  .record(z.string())
  .describe(
    'A map of old topics to new, unified topics. The key is the old topic, and the value is the new unified topic. If a topic is not changed, the value should be the same as the key.'
  );
export type UnifyTopicsOutput = z.infer<typeof UnifyTopicsOutputSchema>;
