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
import { getSuspiciousKeywords } from '@/lib/osint-service';

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
    // In a more advanced scenario, we could pass the dynamically fetched keywords
    // into the prompt itself to let the AI use the latest OSINT data for its analysis.
    // For now, we are keeping the AI prompt generic and using keywords for a separate, deterministic check.
    const {output} = await analyzeThreatMessagePrompt(input);
    return output!;
  }
);


export async function analyzeThreatMessage(input: AnalyzeThreatMessageInput): Promise<AnalyzeThreatMessageOutput> {
  const { high: highRiskKeywords, medium: mediumRiskKeywords, low: lowRiskKeywords } = await getSuspiciousKeywords();
  
  const lowerCaseMessage = input.encryptedMessage.toLowerCase();
  
  const foundHighKeywords = highRiskKeywords.filter(kw => lowerCaseMessage.includes(kw));
  const foundMediumKeywords = mediumRiskKeywords.filter(kw => lowerCaseMessage.includes(kw));
  const foundLowKeywords = lowRiskKeywords.filter(kw => lowerCaseMessage.includes(kw));

  if (foundHighKeywords.length > 0) {
    return {
      threatLevel: 'high',
      keywords: foundHighKeywords,
      patterns: ['High-risk keywords detected'],
      reason: `Message contains high-risk keywords from OSINT source: ${foundHighKeywords.join(', ')}.`,
      warrantsReview: true,
    };
  }

  if (foundMediumKeywords.length > 0) {
    return {
      threatLevel: 'medium',
      keywords: foundMediumKeywords,
      patterns: ['Medium-risk keywords detected'],
      reason: `Message contains medium-risk keywords from OSINT source: ${foundMediumKeywords.join(', ')}.`,
      warrantsReview: true,
    };
  }
  
  if (foundLowKeywords.length > 0) {
    return {
      threatLevel: 'low',
      keywords: foundLowKeywords,
      patterns: ['Low-risk keywords detected'],
      reason: `Message contains low-risk keywords from OSINT source: ${foundLowKeywords.join(', ')}.`,
      warrantsReview: false,
    };
  }

  // Fallback to the AI model if no keywords are matched.
  return analyzeThreatMessageFlow(input);
}
