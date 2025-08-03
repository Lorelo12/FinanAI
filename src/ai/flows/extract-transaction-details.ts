// extract-transaction-details.ts
'use server';

/**
 * @fileOverview A flow for extracting transaction details from natural language text.
 *
 * - extractTransactionDetails - A function that handles the extraction of transaction details.
 * - ExtractTransactionDetailsInput - The input type for the extractTransactionDetails function.
 * - ExtractTransactionDetailsOutput - The return type for the extractTransactionDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTransactionDetailsInputSchema = z.object({
  text: z.string().describe('The natural language text describing the transaction.'),
});

export type ExtractTransactionDetailsInput = z.infer<
  typeof ExtractTransactionDetailsInputSchema
>;

const ExtractTransactionDetailsOutputSchema = z.object({
  amount: z.number().describe('The amount of the transaction.'),
  date: z.string().describe('The date of the transaction in ISO format (YYYY-MM-DD).'),
  description: z.string().describe('A short description of the transaction.'),
  category: z.string().describe('The category of the transaction (e.g., food, transportation, entertainment).'),
});

export type ExtractTransactionDetailsOutput = z.infer<
  typeof ExtractTransactionDetailsOutputSchema
>;

export async function extractTransactionDetails(
  input: ExtractTransactionDetailsInput
): Promise<ExtractTransactionDetailsOutput> {
  return extractTransactionDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTransactionDetailsPrompt',
  input: {schema: ExtractTransactionDetailsInputSchema},
  output: {schema: ExtractTransactionDetailsOutputSchema},
  prompt: `You are a financial assistant. Your task is to extract transaction details from the given text.

  The text will be in portuguese. Pay attention to real.

  Here is the text: {{{text}}}

  Extract the following information:
  - amount: The amount of the transaction. Only the number, no other words.
  - date: The date of the transaction in ISO format (YYYY-MM-DD). If the date is not present in the text, use today\'s date.
  - description: A short description of the transaction. Use the words in the text.
  - category: The category of the transaction (e.g., food, transportation, entertainment). If it is not clear from the text, guess a category.

  Return the information in JSON format.
  `,
  config: {
    model: 'googleai/gemini-2.5-flash',
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

const extractTransactionDetailsFlow = ai.defineFlow(
  {
    name: 'extractTransactionDetailsFlow',
    inputSchema: ExtractTransactionDetailsInputSchema,
    outputSchema: ExtractTransactionDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
