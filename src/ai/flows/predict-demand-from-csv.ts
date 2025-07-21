'use server';

/**
 * @fileOverview Predicts product demand based on CSV data using a local model.
 *
 * - predictDemandFromCsv - A function that handles the demand prediction process from a CSV file.
 * - PredictDemandFromCsvInput - The input type for the predictDemandFromCsv function.
 * - PredictDemandFromCsvOutput - The return type for the predictDemandFromCsv function.
 */

import {z} from 'zod';

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


/**
 * Parses CSV data and performs a simple linear regression to forecast demand.
 * This function simulates a local ML model to remove the dependency on external AI APIs.
 * @param input The CSV data.
 * @returns A demand forecast.
 */
export async function predictDemandFromCsv(input: PredictDemandFromCsvInput): Promise<PredictDemandFromCsvOutput> {
  const { csvData } = input;
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const monthIndex = headers.indexOf('month');
  const salesIndex = headers.indexOf('sales');

  if (monthIndex === -1 || salesIndex === -1) {
    throw new Error("CSV must contain 'Month' and 'Sales' columns.");
  }

  const salesData = lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      month: values[monthIndex].trim(),
      sales: parseInt(values[salesIndex].trim(), 10),
    };
  }).filter(d => !isNaN(d.sales));

  const historicalData = salesData.slice(-6);
  const n = historicalData.length;

  // Simple linear regression (y = a + bx)
  const sumX = (n * (n - 1)) / 2;
  const sumY = historicalData.reduce((acc, d) => acc + d.sales, 0);
  const sumXY = historicalData.reduce((acc, d, i) => acc + i * d.sales, 0);
  const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

  const b = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const a = (sumY - b * sumX) / n;

  const forecastMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const forecastData = forecastMonths.map((month, i) => {
    const prediction = Math.max(0, Math.round(a + b * (n + i)));
    return {
      month,
      predicted: prediction,
    };
  });

  const chartData: PredictDemandFromCsvOutput['chartData'] = [
    ...historicalData.map(d => ({ month: d.month, historical: d.sales, predicted: 0 })),
    ...forecastData.map(d => ({ month: d.month, historical: 0, predicted: d.predicted })),
  ];
  // Smooth graph transition
  if (chartData.length > n) {
    chartData[n-1].predicted = chartData[n-1].historical;
  }
  

  const predictedUnits = forecastData.reduce((sum, item) => sum + item.predicted, 0);
  const salesTrend = b > 0 ? 'Increasing' : 'Decreasing';
  
  const peak = forecastData.reduce((max, item) => item.predicted > max.predicted ? item : max, forecastData[0] || { month: 'N/A', predicted: 0 });
  const peakDemandPeriod = peak.month;

  const summary = `Based on historical data, the sales trend is ${salesTrend.toLowerCase()}. The forecast for the next six months predicts total sales of approximately ${predictedUnits.toLocaleString()} units, with demand expected to peak in ${peakDemandPeriod}.`;

  return {
    summary,
    predictedUnits,
    confidence: 'Medium', // Mock confidence level
    salesTrend,
    peakDemandPeriod,
    chartData,
  };
}
