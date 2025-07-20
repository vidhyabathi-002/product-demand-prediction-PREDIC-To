import { config } from 'dotenv';
config();

import '@/ai/flows/customer-segmentation.ts';
import '@/ai/flows/summarize-market-analysis.ts';
import '@/ai/flows/generate-promotional-text.ts';
import '@/ai/flows/predict-demand-from-csv.ts';
