
"use server";

import { revalidatePath } from 'next/cache';
import { extractBillOrTransactionDetails, ExtractBillOrTransactionDetailsOutput } from '@/ai/flows/extract-bill-or-transaction-details';

export type AIResponseData = ExtractBillOrTransactionDetailsOutput;

export async function addFromText(text: string): Promise<{ success: boolean; data?: AIResponseData[], error?: string }> {
  if (!text) {
    return { success: false, error: 'Input text cannot be empty.' };
  }
  
  // Split by common delimiters like comma, period, 'and' (e), semicolon, or newline.
  const phrases = text.split(/[,.e;\n]/).filter(t => t.trim().length > 2);

  if (phrases.length === 0) {
    return { success: false, error: 'No valid phrases found.' };
  }

  try {
    const promises = phrases.map(async (phrase) => {
      const details = await extractBillOrTransactionDetails({ text: phrase });
      return details;
    });

    const results = await Promise.all(promises);
    
    // For now, we assume revalidating everything is fine.
    // In a more complex app, we might want to be more specific.
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
