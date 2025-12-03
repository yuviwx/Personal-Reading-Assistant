"use server";

import { generateArticleMetadata, GenerateArticleMetadataInput } from '@/ai/flows/generate-article-metadata';

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
