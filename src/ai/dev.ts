import { config } from 'dotenv';
config();

import '@/ai/flows/extract-transaction-details.ts';
import '@/ai/flows/classify-transaction-type.ts';
import '@/ai/flows/suggest-savings-goal.ts';
import '@/ai/flows/extract-bill-or-transaction-details.ts';

// This is a dev-only file that loads all the flows.
// It is not used in production.
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

genkit({
  plugins: [googleAI()],
});
