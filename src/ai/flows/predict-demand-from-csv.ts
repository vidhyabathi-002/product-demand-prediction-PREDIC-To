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
  salesTrend: z.string().describe("Whether the sales trend is 'Increasing' or 'Decreasing' based on the forecast."),
  peakDemandPeriod: z.string().describe("The month or period with the highest predicted demand (e.g., 'August', 'Q3')."),
  chartData: z.array(z.object({
    month: z.string().describe("The month for the data point (e.g., 'Jan', 'Feb')."),
    historical: z.number().describe("The historical sales units for that month. Set to 0 if no historical data is available."),
    predicted: z.number().describe("The predicted sales units for that month. Set to 0 for historical months."),
  })).describe('An array of historical and predicted units.'),
});
export type PredictDemandFromCsvOutput = z.infer<typeof PredictDemandFromCsvOutputSchema>;

export async function predictDemandFromCsv(input: PredictDemandFromCsvInput): Promise<PredictDemandFromCsvOutput> {
  return predictDemandFromCsvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDemandFromCsvPrompt',
  input: {schema: PredictDemandFromCsvInputSchema},
  output: {schema: PredictDemandFromCsvOutputSchema},
  prompt: `You are a data scientist specializing in demand forecasting. Analyze the following sales data from a CSV file. The CSV will have 'Month' and 'Sales' columns.

  Your tasks are:
  1. Extract the last 6 months of historical data.
  2. Predict the future demand for the next six months based on the historical data.
  3. Provide a concise summary of your findings.
  4. Determine if the overall sales trend for the forecast period is 'Increasing' or 'Decreasing'.
  5. Identify the month or period with the highest predicted demand.
  6. Provide the total predicted number of units to be sold over the next 6 months.
  7. Provide your confidence level in this prediction.
  8. Return a 'chartData' array containing 12 months of data: the last 6 months of historical data and the 6 months of forecasted data.
    - For historical months, 'historical' should be the sales number and 'predicted' should be 0.
    - For forecasted months, 'historical' should be 0 and 'predicted' should be the forecasted number.
    - The final predicted value for the last historical month should also be populated in the 'predicted' field for a smoother graph transition.

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
