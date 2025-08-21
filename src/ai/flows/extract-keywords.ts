
'use server';

import fs from 'fs/promises';

/**
 * @fileOverview A Genkit flow for extracting keywords from text using AI.
 *
 * - extractKeywords - A function that handles the AI-powered keyword extraction.
 * - ExtractKeywordsInput - The input type for the extractKeywords function.
 * - ExtractKeywordsOutput - The return type for the extractKeywords function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export async function getKeywordsFromFile(): Promise<string> {
  return fs.readFile('keyword.txt', 'utf-8');
}

const ExtractKeywordsInputSchema = z.object({
  textToAnalyze: z.string().describe("The text from which to extract keywords."),
});
export type ExtractKeywordsInput = z.infer<typeof ExtractKeywordsInputSchema>;

const ExtractKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe("A list of extracted keywords, phrases, or topics."),
});
export type ExtractKeywordsOutput = z.infer<typeof ExtractKeywordsOutputSchema>;

export async function extractKeywords(input: ExtractKeywordsInput): Promise<ExtractKeywordsOutput> {
    return extractKeywordsFlow(input);
}

const extractKeywordsPrompt = ai.definePrompt({
    name: 'extractKeywordsPrompt',
    input: { schema: ExtractKeywordsInputSchema },
    output: { schema: ExtractKeywordsOutputSchema },
    prompt: `Analyze the following text and identify the main keywords, topics, and named entities. Extract the most relevant terms. Focus on specific nouns, technical terms, and proper names.

Text to analyze:
{{{textToAnalyze}}}

Return a list of the identified keywords.`,
});


const extractKeywordsFlow = ai.defineFlow(
  {
    name: 'extractKeywordsFlow',
    inputSchema: ExtractKeywordsInputSchema,
    outputSchema: ExtractKeywordsOutputSchema,
  },
  async (input) => {
    const { output } = await extractKeywordsPrompt(input);
    return output!;
  }
);
