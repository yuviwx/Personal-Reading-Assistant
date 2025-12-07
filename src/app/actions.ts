"use server";

import { generateArticleMetadata, GenerateArticleMetadataInput } from '@/ai/flows/generate-article-metadata';
import { unifyTopics } from '@/ai/flows/unify-topics';
import { UnifyTopicsInput } from '@/ai/flows/unify-topics-types';

export async function generateMetadataAction(
  input: GenerateArticleMetadataInput
) {
  try {
    const result = await generateArticleMetadata(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI metadata generation failed:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}

export async function unifyTopicsAction(
  input: UnifyTopicsInput
) {
    try {
        const result = await unifyTopics(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("AI topic unification failed:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: errorMessage };
    }
}
