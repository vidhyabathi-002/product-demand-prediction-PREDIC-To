// Summarizes market analysis documents to highlight key trends and demand drivers.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarketAnalysisInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A market analysis document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeMarketAnalysisInput = z.infer<
  typeof SummarizeMarketAnalysisInputSchema
>;

const SummarizeMarketAnalysisOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the market analysis document, highlighting key trends, potential demand drivers, and market landscape insights.'
    ),
});
export type SummarizeMarketAnalysisOutput = z.infer<
  typeof SummarizeMarketAnalysisOutputSchema
>;

export async function summarizeMarketAnalysis(
  input: SummarizeMarketAnalysisInput
): Promise<SummarizeMarketAnalysisOutput> {
  return summarizeMarketAnalysisFlow(input);
}

const summarizeMarketAnalysisPrompt = ai.definePrompt({
  name: 'summarizeMarketAnalysisPrompt',
  input: {schema: SummarizeMarketAnalysisInputSchema},
  output: {schema: SummarizeMarketAnalysisOutputSchema},
  prompt: `You are an expert market analyst. Please summarize the following market analysis document, highlighting key trends, potential demand drivers, and market landscape insights.\n\nDocument: {{media url=documentDataUri}}`,
});

const summarizeMarketAnalysisFlow = ai.defineFlow(
  {
    name: 'summarizeMarketAnalysisFlow',
    inputSchema: SummarizeMarketAnalysisInputSchema,
    outputSchema: SummarizeMarketAnalysisOutputSchema,
  },
  async input => {
    const {output} = await summarizeMarketAnalysisPrompt(input);
    return output!;
  }
);
