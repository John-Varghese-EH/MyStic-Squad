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

const analyzeThreatMessagePrompt = ai.definePrompt({
  name: 'analyzeThreatMessagePrompt',
  input: {schema: AnalyzeThreatMessageInputSchema},
  output: {schema: AnalyzeThreatMessageOutputSchema},
  prompt: `You are an AI cybersecurity analyst. Your task is to analyze an encrypted message that may be related to illegal drug sales and assess its threat level.

The message you need to analyze is: {{{encryptedMessage}}}

Based on the content, identify the threat level ('low', 'medium', or 'high'), any suspicious keywords or patterns, and provide a brief reason for your assessment. Also, indicate if the message warrants manual review by a human analyst.

Keywords could include drug names (slang or official), transaction-related terms (e.g., "payment", "delivery"), or quantities. Patterns might involve coded language, meeting arrangements, or attempts to evade detection.

If the message contains clear indicators of a high-risk transaction (e.g., large quantities, specific hard drugs, urgent meeting plans), classify it as 'high' and warranting review. If it's ambiguous but contains some suspicious elements, classify it as 'medium'. If it seems benign or unrelated, classify it as 'low'.`,
});

const analyzeThreatMessageFlow = ai.defineFlow(
  {
    name: 'analyzeThreatMessageFlow',
    inputSchema: AnalyzeThreatMessageInputSchema,
    outputSchema: AnalyzeThreatMessageOutputSchema,
  },
  async (input) => {
    const {output} = await analyzeThreatMessagePrompt(input);
    return output!;
  }
);


export async function analyzeThreatMessage(input: AnalyzeThreatMessageInput): Promise<AnalyzeThreatMessageOutput> {
  // For demonstration, we'll use a mix of dummy logic and a real AI call.
  // This allows for quick, predictable responses for certain inputs,
  // while still having full AI capabilities.
  const lowerCaseMessage = input.encryptedMessage.toLowerCase();

  if (lowerCaseMessage.includes('untraceable') || lowerCaseMessage.includes('kilo')) {
    return {
      threatLevel: 'high',
      keywords: ['untraceable', 'kilo', 'urgent'],
      patterns: ['High-quantity transaction', 'Evasion technique'],
      reason: 'Message discusses large quantities and untraceable methods, indicating a high-risk illicit transaction.',
      warrantsReview: true,
    };
  }
  if (lowerCaseMessage.includes('party pack')) {
     return {
      threatLevel: 'low',
      keywords: ['party pack'],
      patterns: ['Slang for recreational drugs'],
      reason: 'Use of slang indicates potential recreational drug use, but no immediate high-level threat.',
      warrantsReview: false,
    };
  }

  // If no dummy logic matches, call the actual AI flow
  return analyzeThreatMessageFlow(input);
}
