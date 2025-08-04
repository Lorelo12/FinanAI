
import { NextResponse } from 'next/server';
import { extractBillOrTransactionDetails } from '@/ai/flows/extract-bill-or-transaction-details';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'O texto fornecido é muito curto.' }, { status: 400 });
    }

    const details = await extractBillOrTransactionDetails({ text });
    
    if (!details.entries || details.entries.length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhuma transação ou conta válida foi encontrada no texto.' }, { status: 400 });
    }

    const validEntries = details.entries.filter(entry => entry.type !== 'invalid');

    if (validEntries.length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhuma transação ou conta válida foi encontrada no texto.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: validEntries });

  } catch (error) {
    console.error("Error in add-from-text API route:", error);
    let errorMessage = 'Falha ao processar o texto com a IA.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
