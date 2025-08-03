import { config } from 'dotenv';
config();

import '@/ai/flows/extract-transaction-details.ts';
import '@/ai/flows/classify-transaction-type.ts';
import '@/ai/flows/suggest-savings-goal.ts';
import '@/ai/flows/extract-bill-or-transaction-details.ts';
