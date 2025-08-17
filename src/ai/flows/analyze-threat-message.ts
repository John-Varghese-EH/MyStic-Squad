'use server';

/**
 * @fileOverview A threat analysis AI agent for encrypted messages related to illegal drug sales.
 *
 * - analyzeThreatMessage - A function that handles the analysis of encrypted messages.
 * - AnalyzeThreatMessageInput - The input type for the analyzeThreatMessage function.
 * - AnalyzeThreatMessageOutput - The return type for the analyzeThreatMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeThreatMessageInputSchema = z.object({
  encryptedMessage: z.string().describe('The encrypted message to analyze.'),
});
export type AnalyzeThreatMessageInput = z.infer<typeof AnalyzeThreatMessageInputSchema>;

const AnalyzeThreatMessageOutputSchema = z.object({
  threatLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The assessed threat level of the message.'),
  keywords: z.array(z.string()).describe('Keywords identified in the message.'),
  patterns: z.array(z.string()).describe('Patterns identified in the message.'),
  reason: z.string().describe('The reasoning behind the threat level assessment.'),
  warrantsReview: z.boolean().describe('Whether the message warrants manual review based on the threat level.'),
});
export type AnalyzeThreatMessageOutput = z.infer<typeof AnalyzeThreatMessageOutputSchema>;

export async function analyzeThreatMessage(input: AnalyzeThreatMessageInput): Promise<AnalyzeThreatMessageOutput> {
  return analyzeThreatMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeThreatMessagePrompt',
  input: {schema: AnalyzeThreatMessageInputSchema},
  output: {schema: AnalyzeThreatMessageOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in identifying illegal drug sales activities in encrypted messages.

You will analyze the provided encrypted message to identify potential threats, assess the threat level, and extract relevant keywords and patterns.

Based on your analysis, you will determine whether the message warrants manual review.

Encrypted Message: {{{encryptedMessage}}}

Respond in JSON format.
`,
});

const analyzeThreatMessageFlow = ai.defineFlow(
  {
    name: 'analyzeThreatMessageFlow',
    inputSchema: AnalyzeThreatMessageInputSchema,
    outputSchema: AnalyzeThreatMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    // Logic to determine if message warrants manual review
    const warrantsReview = output!.threatLevel === 'high' || output!.threatLevel === 'medium';

    return {
      ...output!,
      warrantsReview,
    };
  }
);
