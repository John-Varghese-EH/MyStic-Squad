'use server';
/**
 * @fileOverview A drug awareness chatbot that provides helpful information.
 *
 * - chatAboutDrugs - A function that handles the chat interaction.
 * - DrugChatInput - The input type for the chatAboutDrugs function.
 * - DrugChatOutput - The return type for the chatAboutDrugs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DrugChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type DrugChatInput = z.infer<typeof DrugChatInputSchema>;

const DrugChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type DrugChatOutput = z.infer<typeof DrugChatOutputSchema>;


export async function chatAboutDrugs(input: DrugChatInput): Promise<DrugChatOutput> {
  return drugAwarenessChatFlow(input);
}

const drugAwarenessChatPrompt = ai.definePrompt({
  name: 'drugAwarenessChatPrompt',
  input: {schema: DrugChatInputSchema},
  output: {schema: DrugChatOutputSchema},
  prompt: `You are a friendly and supportive AI assistant for a drug awareness program. Your goal is to provide helpful, non-judgmental information about the risks and consequences of drug use. You should not give medical advice, but you can provide information from reliable sources and encourage users to seek help from professionals.

User message: {{{message}}}

Provide a supportive and informative response. If the user seems to be in distress or asks for help, suggest they contact a crisis hotline or a healthcare professional. Keep your answers concise and easy to understand.`,
});


const drugAwarenessChatFlow = ai.defineFlow(
  {
    name: 'drugAwarenessChatFlow',
    inputSchema: DrugChatInputSchema,
    outputSchema: DrugChatOutputSchema,
  },
  async (input) => {
    const {output} = await drugAwarenessChatPrompt(input);
    return output!;
  }
);
