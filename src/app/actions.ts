
import { ExtractBillOrTransactionDetailsOutput } from '@/ai/flows/extract-bill-or-transaction-details';

export type AIResponseData = ExtractBillOrTransactionDetailsOutput['entries'];

export async function addFromText(text: string): Promise<{ success: boolean; data?: AIResponseData, error?: string }> {
  if (!text || text.trim().length < 3) {
    return { success: false, error: 'O texto fornecido é muito curto.' };
  }

  try {
    const response = await fetch('/api/add-from-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error calling add-from-text API:", error);
    let errorMessage = 'Falha ao se comunicar com a API.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
