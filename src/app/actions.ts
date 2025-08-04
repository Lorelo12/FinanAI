
"use server";

import { revalidatePath } from 'next/cache';
import { extractBillOrTransactionDetails, ExtractBillOrTransactionDetailsOutput } from '@/ai/flows/extract-bill-or-transaction-details';

export type AIResponseData = ExtractBillOrTransactionDetailsOutput['entries'];

export async function addFromText(text: string): Promise<{ success: boolean; data?: AIResponseData, error?: string }> {
  if (!text || text.trim().length < 3) {
    return { success: false, error: 'O texto fornecido é muito curto.' };
  }

  try {
    const details = await extractBillOrTransactionDetails({ text });
    
    if (!details.entries || details.entries.length === 0) {
      return { success: false, error: 'Nenhuma transação ou conta válida foi encontrada no texto.' };
    }

    const validEntries = details.entries.filter(entry => entry.type !== 'invalid');

    if (validEntries.length === 0) {
        return { success: false, error: 'Nenhuma transação ou conta válida foi encontrada no texto.' };
    }

    revalidatePath('/'); 
    revalidatePath('/bills');

    return { success: true, data: validEntries };

  } catch (error) {
    console.error("Error in addFromText server action:", error);
    let errorMessage = 'Falha ao processar o texto com a IA.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
