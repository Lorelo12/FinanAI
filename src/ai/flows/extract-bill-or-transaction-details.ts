// extract-bill-or-transaction-details.ts
'use server';

/**
 * @fileOverview A flow for extracting transaction or bill details from natural language text.
 *
 * - extractBillOrTransactionDetails - A function that handles the extraction of details.
 * - ExtractBillOrTransactionDetailsInput - The input type for the function.
 * - ExtractBillOrTransactionDetailsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractBillOrTransactionDetailsInputSchema = z.object({
  text: z
    .string()
    .describe('The natural language text describing the transaction or bill.'),
});

export type ExtractBillOrTransactionDetailsInput = z.infer<
  typeof ExtractBillOrTransactionDetailsInputSchema
>;

const ExtractBillOrTransactionDetailsOutputSchema = z.object({
  type: z
    .enum(['transaction', 'bill'])
    .describe('The type of entry: a one-time transaction or a recurring bill.'),
  amount: z
    .number()
    .optional()
    .describe(
      'The amount. Required for transactions, optional for bills if not mentioned.'
    ),
  date: z
    .string()
    .optional()
    .describe(
      'The transaction date in ISO format (YYYY-MM-DD). Use today if not mentioned. Not applicable for bills.'
    ),
  description: z.string().describe('A short description.'),
  category: z
    .string()
    .optional()
    .describe(
      'The category (e.g., food, transportation). Not applicable for bills.'
    ),
  transactionType: z
    .enum(['income', 'expense'])
    .optional()
    .describe("The type of transaction. Not applicable for bills."),
  dueDate: z
    .number()
    .optional()
    .describe(
      'The day of the month the bill is due. Only applicable for bills.'
    ),
});

export type ExtractBillOrTransactionDetailsOutput = z.infer<
  typeof ExtractBillOrTransactionDetailsOutputSchema
>;

export async function extractBillOrTransactionDetails(
  input: ExtractBillOrTransactionDetailsInput
): Promise<ExtractBillOrTransactionDetailsOutput> {
  return extractBillOrTransactionDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractBillOrTransactionDetailsPrompt',
  input: {schema: ExtractBillOrTransactionDetailsInputSchema},
  output: {schema: ExtractBillOrTransactionDetailsOutputSchema},
  prompt: `You are a financial assistant. Your task is to analyze the user's text and determine if they are logging a one-time transaction or setting up a recurring monthly bill. The text is in Portuguese.

- If the text describes a recurring payment (e.g., "conta de luz todo dia 10", "aluguel vence dia 5", "internet R$99,90 todo dia 15"), set the type to "bill".
  - For bills, you must extract:
    - 'description': The name of the bill (e.g., "conta de luz", "aluguel").
    - 'dueDate': The day of the month it's due.
    - 'amount': The value of the bill, if mentioned.
- Otherwise, assume it's a one-time transaction and set the type to "transaction".
  - For transactions, you must extract:
    - 'description': What the transaction was for.
    - 'amount': The value of the transaction.
    - 'date': The date it occurred (use today's date if not specified, format YYYY-MM-DD).
    - 'category': A suitable category (e.g., food, salary, bills).
    - 'transactionType': Classify as 'income' or 'expense'.

Analyze the following text: {{{text}}}

Return the information in the specified JSON format.
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

const extractBillOrTransactionDetailsFlow = ai.defineFlow(
  {
    name: 'extractBillOrTransactionDetailsFlow',
    inputSchema: ExtractBillOrTransactionDetailsInputSchema,
    outputSchema: ExtractBillOrTransactionDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
