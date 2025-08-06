// classify-transaction-type.ts
'use server';

/**
 * @fileOverview A flow for classifying a transaction as either an expense or income.
 *
 * - classifyTransactionType - A function that classifies the transaction type.
 * - ClassifyTransactionTypeInput - The input type for the classifyTransactionType function.
 * - ClassifyTransactionTypeOutput - The return type for the classifyTransactionType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyTransactionTypeInputSchema = z.object({
  text: z.string().describe('The natural language text describing the transaction.'),
});

export type ClassifyTransactionTypeInput = z.infer<
  typeof ClassifyTransactionTypeInputSchema
>;

const ClassifyTransactionTypeOutputSchema = z.object({
  type: z.enum(['expense', 'income']).describe('The type of the transaction.'),
});

export type ClassifyTransactionTypeOutput = z.infer<
  typeof ClassifyTransactionTypeOutputSchema
>;

export async function classifyTransactionType(
  input: ClassifyTransactionTypeInput
): Promise<ClassifyTransactionTypeOutput> {
  return classifyTransactionTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyTransactionTypePrompt',
  input: {schema: ClassifyTransactionTypeInputSchema},
  output: {schema: ClassifyTransactionTypeOutputSchema},
  prompt: `You are a financial assistant. Your task is to classify the given transaction text as either an expense or income.

  Here is the transaction text: {{{text}}}

  Classify the transaction as either "expense" or "income".
  Return only one word.
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

const classifyTransactionTypeFlow = ai.defineFlow(
  {
    name: 'classifyTransactionTypeFlow',
    inputSchema: ClassifyTransactionTypeInputSchema,
    outputSchema: ClassifyTransactionTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
