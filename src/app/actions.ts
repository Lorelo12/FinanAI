
"use server";

import { extractTransactionDetails, ExtractTransactionDetailsOutput } from '@/ai/flows/extract-transaction-details';
import { classifyTransactionType } from '@/ai/flows/classify-transaction-type';
import { revalidatePath } from 'next/cache';

export type AITransactionData = ExtractTransactionDetailsOutput & { type: 'income' | 'expense' };

export async function addTransactionFromText(text: string): Promise<{ success: boolean; data?: AITransactionData, error?: string }> {
  if (!text) {
    return { success: false, error: 'Input text cannot be empty.' };
  }
  
  try {
    const [details, classification] = await Promise.all([
      extractTransactionDetails({ text }),
      classifyTransactionType({ text }),
    ]);
    
    const transactionData: AITransactionData = {
      ...details,
      type: classification.type,
    };

    revalidatePath('/'); // Revalidate dashboard page
    return { success: true, data: transactionData };

  } catch (error) {
    console.error("Error in addTransactionFromText server action:", error);
    let errorMessage = 'Failed to extract transaction details.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
