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
  modelUsed: z.string().describe('The machine learning model used for the prediction.'),
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
  
  // Make parsing more robust: assume first column is month, second is sales.
  const salesData = lines.slice(1).map(line => {
    const values = line.split(',');
    // Basic validation to ensure we have at least two columns.
    if (values.length < 2) {
      return null;
    }
    const salesValue = parseInt(values[1].trim(), 10);
    return {
      month: values[0].trim(),
      sales: isNaN(salesValue) ? 0 : salesValue,
    };
  }).filter(d => d !== null) as { month: string, sales: number }[];

  if (salesData.length === 0) {
    throw new Error("Could not parse valid sales data from the CSV.");
  }

  const historicalData = salesData.slice(-6);
  const n = historicalData.length;
  if (n === 0) {
    throw new Error("Not enough historical data to make a prediction.");
  }


  // Simulate a more complex model (like ARIMA) by incorporating trend and seasonality.
  // 1. Calculate base trend (similar to linear regression)
  const sumY = historicalData.reduce((acc, d) => acc + d.sales, 0);
  const avgSales = sumY / n;
  const trend = (historicalData[n-1].sales - historicalData[0].sales) / (n -1);

  // 2. Simulate seasonality (e.g., a simple sine wave for this mock)
  const seasonalityFactor = 0.1; // 10% swing due to seasonality

  const forecastMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const forecastData = forecastMonths.map((month, i) => {
    const trendValue = historicalData[n-1].sales + trend * (i + 1);
    const seasonalValue = avgSales * seasonalityFactor * Math.sin((Math.PI * i) / (forecastMonths.length -1));
    const randomNoise = (Math.random() - 0.5) * (avgSales * 0.05); // +/- 2.5% random noise
    
    const prediction = Math.max(0, Math.round(trendValue + seasonalValue + randomNoise));

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
  if (chartData.length > n && n > 0) {
    chartData[n-1].predicted = chartData[n-1].historical;
  }
  

  const predictedUnits = forecastData.reduce((sum, item) => sum + item.predicted, 0);
  const salesTrend = trend > 0 ? 'Increasing' : 'Decreasing';
  
  const peak = forecastData.reduce((max, item) => item.predicted > max.predicted ? item : max, forecastData[0] || { month: 'N/A', predicted: 0 });
  const peakDemandPeriod = peak.month;

  const summary = `Using a simulated ARIMA model, the forecast accounts for both overall trend and seasonal variations. The sales trend is ${salesTrend.toLowerCase()}, with total predicted sales of approximately ${predictedUnits.toLocaleString()} units. Demand is expected to peak in ${peakDemandPeriod}.`;

  return {
    summary,
    predictedUnits,
    confidence: 'Medium', // Mock confidence level
    salesTrend,
    peakDemandPeriod,
    chartData,
    modelUsed: "Simulated ARIMA",
  };
}
