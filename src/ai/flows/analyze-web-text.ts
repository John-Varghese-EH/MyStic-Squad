
'use server';

/**
 * @fileOverview A Genkit flow for analyzing web text for suspicious keywords.
 *
 * - analyzeWebText - A function that handles the analysis of a URL or raw text.
 * - AnalyzeWebTextInput - The input type for the analyzeWebText function.
 * - AnalyzeWebTextOutput - The return type for the analyzeWebText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fs from 'fs/promises';

// This function simulates fetching content from a URL.
// In a real-world application, you would replace this with actual
// web scraping or content fetching logic using a library like `node-fetch`
// or `axios`, potentially with safeguards against malicious sites or
// excessive resource usage. Ensure compliance with robots.txt and terms of service.
async function fetchUrlContent(url: string): Promise<string> {
    // --- REAL IMPLEMENTATION GOES HERE ---
    // const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    // const data = await response.json();
    // const text = data.contents.replace(/<[^>]*>/g, ''); // Basic tag stripping (consider a more robust HTML parser)
    // return text;
    console.log(`Simulating fetch for: ${url}`);
    return `This is simulated text content from the URL: ${url}. It mentions various keywords for testing purposes like payment, transfer, and crypto.`;
}

const AnalyzeWebTextInputSchema = z.object({
  url: z.string().optional().describe("A public website URL to scan."),
  text: z.string().optional().describe("Raw text/HTML content to scan."),
});
export type AnalyzeWebTextInput = z.infer<typeof AnalyzeWebTextInputSchema>;

const DetectedKeywordSchema = z.object({
  word: z.string().describe("The detected keyword."),
  category: z.string().describe("The category of the keyword (e.g., 'finance', 'gambling')."),
  weight: z.number().describe("The risk weight of the keyword."),
  count: z.number().describe("How many times the keyword appeared."),
});

const AnalyzeWebTextOutputSchema = z.object({
  detectedKeywords: z.array(DetectedKeywordSchema).describe("A list of keywords found in the text."),
  totalOccurrences: z.number().describe("The total count of all keyword occurrences."),
  riskLevel: z.enum(['low', 'medium', 'high']).describe("The calculated risk level based on keywords."),
});
export type AnalyzeWebTextOutput = z.infer<typeof AnalyzeWebTextOutputSchema>;

export async function analyzeWebText(input: AnalyzeWebTextInput): Promise<AnalyzeWebTextOutput> {
    return analyzeWebTextFlow(input);
}

const analyzeWebTextFlow = ai.defineFlow(
  {
    name: 'analyzeWebTextFlow',
    inputSchema: AnalyzeWebTextInputSchema,
    outputSchema: AnalyzeWebTextOutputSchema,
  },
  async (input) => {
    if (!input.url && !input.text) {
        throw new Error("Either a URL or text must be provided for analysis.");
    }
    
    let contentToAnalyze = '';
    if (input.url) {
        contentToAnalyze = await fetchUrlContent(input.url);
    } else if (input.text) {
        contentToAnalyze = input.text;
    }

    // Read keywords from keyword.txt
    let keywords: { word: string; weight: number; category: string; }[] = [];
    try {
        const keywordFileContent = await fs.readFile('keyword.txt', 'utf-8');
        keywords = keywordFileContent.split('\n').filter(line => line.trim() !== '').map(word => ({ word: word.trim(), weight: 5, category: 'Custom' }));
    } catch (error) {
        console.error("Error reading keyword.txt:", error);
        // Continue with an empty keyword list if file reading fails
    }
    const lowerCaseContent = contentToAnalyze.toLowerCase();

    let totalScore = 0;
    let totalOccurrences = 0;

    const detectedKeywords = keywords
        .map(keyword => {
            // Use a regex to count whole word occurrences for custom keywords
            const regex = new RegExp(`\\b${keyword.word.toLowerCase()}\\b`, 'g');
            const matches = lowerCaseContent.match(regex);
            const count = matches ? matches.length : 0;
            return { ...keyword, count };
        })
        .filter(kw => kw.count > 0);

    detectedKeywords.forEach(kw => {
        totalScore += kw.weight * kw.count;
        totalOccurrences += kw.count;
    });

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (totalScore >= 20) {
        riskLevel = 'high';
    } else if (totalScore >= 10) {
        riskLevel = 'medium';
    }

    return {
        detectedKeywords,
        totalOccurrences,
        riskLevel,
    };
  }
);
