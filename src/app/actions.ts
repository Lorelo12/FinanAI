
"use server";

import { revalidatePath } from 'next/cache';
import { extractBillOrTransactionDetails, ExtractBillOrTransactionDetailsOutput } from '@/ai/flows/extract-bill-or-transaction-details';

export type AIResponseData = ExtractBillOrTransactionDetailsOutput;

export async function addFromText(text: string): Promise<{ success: boolean; data?: AIResponseData[], error?: string }> {
  if (!text) {
    return { success: false, error: 'Input text cannot be empty.' };
  }
  
  // Split by common delimiters like comma, semicolon, or newline.
  const phrases = text.split(/[,;\n]/).filter(t => t.trim().length > 2);

  if (phrases.length === 0) {
    // If splitting doesn't yield multiple phrases, treat the whole text as one.
    phrases.push(text);
  }

  try {
    const promises = phrases.map(async (phrase) => {
      if (phrase.trim().length < 3) return null; // Ignore very short phrases
      const details = await extractBillOrTransactionDetails({ text: phrase });
      return details;
    });

    const results = (await Promise.all(promises)).filter(Boolean) as AIResponseData[];
    
    if (results.length === 0) {
      return { success: false, error: 'Nenhuma transação ou conta válida foi encontrada no texto.' };
    }

    revalidatePath('/'); 
    revalidatePath('/bills');

    return { success: true, data: results };

  } catch (error) {
    console.error("Error in addFromText server action:", error);
    let errorMessage = 'Failed to process text.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
