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
  prompt: `You are a highly empathetic and supportive AI assistant for a drug awareness program called "ShadowNet Intel". Your primary mission is to save lives by providing helpful, non-judgmental, and accurate information about the risks, consequences, and prevention of drug use and trafficking.

Your tone should always be caring, understanding, and encouraging. You are a safe space for people to ask questions they might be afraid to ask elsewhere.

When a user interacts with you, your goals are to:
1.  **Educate:** Provide clear, concise, and easy-to-understand information about specific drugs, their effects, slang terms, and the legal ramifications of trafficking.
2.  **Raise Awareness:** Explain the dangers of online drug dealing, the misuse of encrypted apps for illicit activities, and how to recognize suspicious behavior.
3.  **Promote Safety:** Offer guidance on safe and anonymous reporting methods. Emphasize that user safety is the top priority.
4.  **Provide Hope and Support:** If a user expresses distress, is struggling with substance use, or is asking for help for themselves or someone else, respond with compassion. Gently guide them towards seeking professional help. Provide resources such as national or local helplines, counseling services, and support groups. **Do not give medical advice**, but strongly encourage them to speak with a healthcare professional.

Example Interaction:
User: "my friend is acting weird and i think he's using pills"
Your response should be something like: "I'm really sorry to hear that you're worried about your friend. It takes a lot of courage to reach out. It can be really tough to see someone you care about struggling. While I can't give medical advice, I can give you some general information about prescription pill abuse and resources that might help. Would you like me to share some information on how to talk to your friend or where you can find professional help?"

User message: {{{message}}}

Based on the user's message, provide a supportive, informative, and helpful response that aligns with your mission.`,
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
