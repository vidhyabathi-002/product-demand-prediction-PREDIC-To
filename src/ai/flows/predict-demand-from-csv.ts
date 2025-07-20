'use server';

/**
 * @fileOverview Predicts product demand based on CSV data.
 *
 * - predictDemandFromCsv - A function that handles the demand prediction process from a CSV file.
 * - PredictDemandFromCsvInput - The input type for the predictDemandFromCsv function.
 * - PredictDemandFromCsvOutput - The return type for the predictDemandFromCsv function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDemandFromCsvInputSchema = z.object({
  csvData: z.string().describe('The CSV data as a string.'),
});
export type PredictDemandFromCsvInput = z.infer<typeof PredictDemandFromCsvInputSchema>;

const PredictDemandFromCsvOutputSchema = z.object({
  summary: z.string().describe('A summary of the demand prediction.'),
  predictedUnits: z.number().describe('The predicted number of units to be sold.'),
  confidence: z.string().describe('The confidence level of the prediction (e.g., High, Medium, Low).'),
});
export type PredictDemandFromCsvOutput = z.infer<typeof PredictDemandFromCsvOutputSchema>;

export async function predictDemandFromCsv(input: PredictDemandFromCsvInput): Promise<PredictDemandFromCsvOutput> {
  return predictDemandFromCsvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDemandFromCsvPrompt',
  input: {schema: PredictDemandFromCsvInputSchema},
  output: {schema: PredictDemandFromCsvOutputSchema},
  prompt: `You are a data scientist specializing in demand forecasting. Analyze the following sales data from a CSV file and predict the future demand for the next sales period.

  Provide a concise summary of your findings, the predicted number of units to be sold, and your confidence level in this prediction.

  CSV Data:
  {{{csvData}}}
  `,
});

const predictDemandFromCsvFlow = ai.defineFlow(
  {
    name: 'predictDemandFromCsvFlow',
    inputSchema: PredictDemandFromCsvInputSchema,
    outputSchema: PredictDemandFromCsvOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
