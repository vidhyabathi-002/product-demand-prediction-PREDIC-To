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
  predictedUnits: z.number().describe('The predicted number of units to be sold for the entire forecast period.'),
  confidence: z.string().describe('The confidence level of the prediction (e.g., High, Medium, Low).'),
  forecastData: z.array(z.object({
    month: z.string().describe("The month for the forecast (e.g., 'Jan', 'Feb')."),
    units: z.number().describe("The predicted number of units for that month."),
  })).describe('An array of predicted units for the next 6 months.'),
});
export type PredictDemandFromCsvOutput = z.infer<typeof PredictDemandFromCsvOutputSchema>;

export async function predictDemandFromCsv(input: PredictDemandFromCsvInput): Promise<PredictDemandFromCsvOutput> {
  return predictDemandFromCsvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDemandFromCsvPrompt',
  input: {schema: PredictDemandFromCsvInputSchema},
  output: {schema: PredictDemandFromCsvOutputSchema},
  prompt: `You are a data scientist specializing in demand forecasting. Analyze the following sales data from a CSV file and predict the future demand for the next six months.

  Provide a concise summary of your findings, the total predicted number of units to be sold over the next 6 months, your confidence level in this prediction, and a monthly breakdown of the forecast.

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
