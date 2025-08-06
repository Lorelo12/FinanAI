// suggest-savings-goal.ts
'use server';

/**
 * @fileOverview A flow for suggesting savings goals based on transaction history and income.
 *
 * - suggestSavingsGoal - A function that suggests a savings goal.
 * - SuggestSavingsGoalInput - The input type for the suggestSavingsGoal function.
 * - SuggestSavingsGoalOutput - The return type for the suggestSavingsGoal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSavingsGoalInputSchema = z.object({
  transactionHistory: z.string().describe('The transaction history of the user.'),
  income: z.number().describe('The monthly income of the user.'),
});

export type SuggestSavingsGoalInput = z.infer<typeof SuggestSavingsGoalInputSchema>;

const SuggestSavingsGoalOutputSchema = z.object({
  goal: z.string().describe('The suggested savings goal.'),
  amount: z.number().describe('The suggested amount to save.'),
  reasoning: z.string().describe('The reasoning behind the suggested savings goal.'),
});

export type SuggestSavingsGoalOutput = z.infer<typeof SuggestSavingsGoalOutputSchema>;

export async function suggestSavingsGoal(
  input: SuggestSavingsGoalInput
): Promise<SuggestSavingsGoalOutput> {
  return suggestSavingsGoalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSavingsGoalPrompt',
  input: {schema: SuggestSavingsGoalInputSchema},
  output: {schema: SuggestSavingsGoalOutputSchema},
  prompt: `You are a financial advisor. Your task is to suggest a savings goal to the user based on their transaction history and income.

Here is the user's transaction history: {{{transactionHistory}}}
Here is the user's monthly income: {{{income}}}

Suggest a savings goal, the amount to save, and the reasoning behind the suggestion. The answer must be in portuguese.
Return the information in JSON format.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestSavingsGoalFlow = ai.defineFlow(
  {
    name: 'suggestSavingsGoalFlow',
    inputSchema: SuggestSavingsGoalInputSchema,
    outputSchema: SuggestSavingsGoalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
