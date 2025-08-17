'use server';
/**
 * @fileOverview This file defines a Genkit flow for flagging messages for review based on AI analysis.
 *
 * - flagMessageForReview - A function that flags messages for manual review.
 * - FlagMessageForReviewInput - The input type for the flagMessageForReview function.
 * - FlagMessageForReviewOutput - The return type for the flagMessageForReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagMessageForReviewInputSchema = z.object({
  message: z.string().describe('The encrypted message content.'),
  senderId: z.string().optional().describe('The ID of the message sender.'),
  timestamp: z.string().describe('The timestamp of the message.'),
});
export type FlagMessageForReviewInput = z.infer<typeof FlagMessageForReviewInputSchema>;

const FlagMessageForReviewOutputSchema = z.object({
  warrantReview: z.boolean().describe('Whether the message warrants manual review.'),
  reason: z.string().describe('The reason why the message was flagged for review.'),
  riskScore: z.number().describe('A score indicating the risk level of the message.'),
});
export type FlagMessageForReviewOutput = z.infer<typeof FlagMessageForReviewOutputSchema>;

export async function flagMessageForReview(input: FlagMessageForReviewInput): Promise<FlagMessageForReviewOutput> {
  return flagMessageForReviewFlow(input);
}

const flagMessageForReviewPrompt = ai.definePrompt({
  name: 'flagMessageForReviewPrompt',
  input: {schema: FlagMessageForReviewInputSchema},
  output: {schema: FlagMessageForReviewOutputSchema},
  prompt: `You are an AI cybersecurity analyst tasked with reviewing encrypted messages and flagging those that warrant manual review by a human analyst.

  Analyze the following message and determine if it is related to illegal drug sales or other illicit activities. Consider keywords, patterns, sender reputation, and message context.

  Message: {{{message}}}
  Sender ID: {{senderId}}
  Timestamp: {{{timestamp}}}

  Based on your analysis, determine whether the message warrants manual review. Provide a reason for your decision and a risk score (0-100) indicating the level of risk associated with the message.

  Output should be structured as follows:
  {
  "warrantReview": true/false,
  "reason": "Explanation of why the message was flagged",
  "riskScore": 0-100
  }`,
});

const flagMessageForReviewFlow = ai.defineFlow(
  {
    name: 'flagMessageForReviewFlow',
    inputSchema: FlagMessageForReviewInputSchema,
    outputSchema: FlagMessageForReviewOutputSchema,
  },
  async input => {
    const {output} = await flagMessageForReviewPrompt(input);
    return output!;
  }
);
