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


const predefinedQuestions: Record<string, string> = {
    "what is drug trafficking?": "Drug trafficking is the crime of selling, transporting, or illegally importing unlawful controlled substances, such as heroin, cocaine, marijuana, or other illegal drugs.",
    "how to report suspicious activity?": "You can report suspicious activity to your local law enforcement agency. Some jurisdictions have specific hotlines or online forms for this purpose. For the purpose of this demo, you can use the 'Case Management' page.",
    "what are cert roles?": "CERT (Community Emergency Response Team) members are trained volunteers who can assist in their communities during emergencies. Their roles can include light search and rescue, disaster medical operations, and fire suppression."
};


export async function chatAboutDrugs(input: DrugChatInput): Promise<DrugChatOutput> {
  const lowerCaseMessage = input.message.toLowerCase().trim();
  if (predefinedQuestions[lowerCaseMessage]) {
    return { response: predefinedQuestions[lowerCaseMessage] };
  }
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
