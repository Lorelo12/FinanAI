
"use server";

import { extractTransactionDetails, ExtractTransactionDetailsOutput } from '@/ai/flows/extract-transaction-details';
import { classifyTransactionType } from '@/ai/flows/classify-transaction-type';
import { revalidatePath } from 'next/cache';

export type AITransactionData = ExtractTransactionDetailsOutput & { type: 'income' | 'expense' };

export async function addTransactionsFromText(text: string): Promise<{ success: boolean; data?: AITransactionData[], error?: string }> {
  if (!text) {
    return { success: false, error: 'Input text cannot be empty.' };
  }
  
  const transactionTexts = text.split(/[,.e;\n]/).filter(t => t.trim().length > 2);

  if (transactionTexts.length === 0) {
    return { success: false, error: 'No valid transaction phrases found.' };
  }

  try {
    const transactionPromises = transactionTexts.map(async (transactionText) => {
      const [details, classification] = await Promise.all([
        extractTransactionDetails({ text: transactionText }),
        classifyTransactionType({ text: transactionText }),
      ]);
      
      const transactionData: AITransactionData = {
        ...details,
        type: classification.type,
      };
      return transactionData;
    });

    const transactionsData = await Promise.all(transactionPromises);

    revalidatePath('/'); // Revalidate dashboard page
    return { success: true, data: transactionsData };

  } catch (error) {
    console.error("Error in addTransactionsFromText server action:", error);
    let errorMessage = 'Failed to extract transaction details.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
