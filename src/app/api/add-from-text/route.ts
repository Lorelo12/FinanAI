// src/app/api/add-from-text/route.ts
import { extractBillOrTransactionDetails } from '@/ai/flows/extract-bill-or-transaction-details';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'O texto fornecido é muito curto.' }, { status: 400 });
    }

    const result = await extractBillOrTransactionDetails({ text });

    if (!result || !result.entries) {
        return NextResponse.json({ success: false, error: 'A IA não conseguiu processar o texto.' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: result.entries });

  } catch (error) {
    console.error('Error in add-from-text API:', error);
    let errorMessage = 'Falha ao se comunicar com a IA.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
