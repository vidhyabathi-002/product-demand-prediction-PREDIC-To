
'use server';

/**
 * @fileOverview Predicts product demand based on CSV data using a local model.
 *
 * - predictDemandFromCsv - A function that handles the demand prediction process from a CSV file.
 * - PredictDemandFromCsvInput - The input type for the predictDemandFromCsv function.
 * - PredictDemandFromCsvOutput - The return type for the predictDemandFromCsv function.
 */

import {z} from 'zod';

export type ModelType = "ARIMA" | "Prophet" | "LSTM" | "Random Forest" | "XGBoost";

const PredictDemandFromCsvInputSchema = z.object({
  csvData: z.string().describe('The CSV data as a string.'),
  model: z.enum(["ARIMA", "Prophet", "LSTM", "Random Forest", "XGBoost"]).describe('The machine learning model to use for the prediction.')
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
  accuracy: z.number().describe('The accuracy of the model prediction as a percentage.'),
  f1Score: z.number().describe('The F1 score of the model prediction.'),
  mae: z.number().describe('Mean Absolute Error of the model prediction.'),
  rmse: z.number().describe('Root Mean Squared Error of the model prediction.'),
  rSquared: z.number().describe('R-squared score of the model prediction.'),
  confusionMatrix: z.object({
    truePositive: z.number(),
    falsePositive: z.number(),
    trueNegative: z.number(),
    falseNegative: z.number(),
  }).describe('Confusion matrix data for binary classification visualization.'),
  rocAucScore: z.number().describe('ROC-AUC score for the model prediction.'),
  featureImportance: z.array(z.object({
    feature: z.string(),
    importance: z.number(),
  })).describe('Feature importance scores for heatmap visualization.'),
});
export type PredictDemandFromCsvOutput = z.infer<typeof PredictDemandFromCsvOutputSchema>;


/**
 * Parses CSV data, splits it into training and testing sets, simulates model training,
 * evaluates performance, and then generates a future demand forecast.
 * @param input The CSV data and selected model.
 * @returns A demand forecast.
 */
export async function predictDemandFromCsv(input: PredictDemandFromCsvInput): Promise<PredictDemandFromCsvOutput> {
  const { csvData, model } = input;
  const lines = csvData.trim().split('\n');
  
  // 1. DATA PREPROCESSING
  const header = lines[0].split(',').map(h => h.trim());
  const monthIndex = 0;
  const salesIndex = 1;

  const historicalData = lines.slice(1).map(line => {
    const values = line.split(',');
    if (values.length < 2) return null;
    const salesValue = parseInt(values[salesIndex].trim(), 10);
    return {
      month: values[monthIndex].trim(),
      sales: isNaN(salesValue) ? 0 : salesValue,
    };
  }).filter(d => d !== null && d.sales > 0) as { month: string, sales: number }[];

  if (historicalData.length < 4) { // Need at least 4 data points for a meaningful split
    throw new Error("Not enough historical data. Please provide a CSV with at least 4 months of sales.");
  }

  // 2. TRAIN/TEST SPLIT
  // We'll use the last 25% of the data for testing, minimum 1 data point.
  const testSize = Math.max(1, Math.floor(historicalData.length * 0.25));
  const trainData = historicalData.slice(0, historicalData.length - testSize);
  const testData = historicalData.slice(historicalData.length - testSize);
  
  // 3. SIMULATED MODEL TRAINING (using the training set)
  // We'll simulate training by calculating a simple linear trend from the training data.
  const nTrain = trainData.length;
  const sumX = trainData.reduce((acc, _, i) => acc + i, 0);
  const sumY = trainData.reduce((acc, d) => acc + d.sales, 0);
  const sumXY = trainData.reduce((acc, d, i) => acc + i * d.sales, 0);
  const sumXX = trainData.reduce((acc, _, i) => acc + i * i, 0);
  
  const slope = (nTrain * sumXY - sumX * sumY) / (nTrain * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / nTrain;

  // Model-specific adjustments
  let modelNoiseFactor = 0.1;
  let confidence = "Medium";
  switch(model) {
      case "Prophet": confidence = "High"; modelNoiseFactor = 0.08; break;
      case "XGBoost": confidence = "High"; modelNoiseFactor = 0.05; break;
      case "Random Forest": confidence = "High"; modelNoiseFactor = 0.06; break;
      case "LSTM": confidence = "Medium"; modelNoiseFactor = 0.12; break;
      case "ARIMA": default: confidence = "Medium"; modelNoiseFactor = 0.1; break;
  }
  
  // 4. SIMULATED TESTING & METRICS CALCULATION
  const predictionsOnTest = testData.map((_, i) => {
      const timeStep = nTrain + i; // Continue the time series from the training data
      const prediction = slope * timeStep + intercept;
      // Add model-specific noise to make it more realistic
      const noise = (Math.random() - 0.5) * prediction * modelNoiseFactor;
      return Math.max(0, prediction + noise);
  });

  const actualsOnTest = testData.map(d => d.sales);
  const errors = actualsOnTest.map((actual, i) => actual - predictionsOnTest[i]);
  const absErrors = errors.map(e => Math.abs(e));
  
  const mae = absErrors.reduce((acc, e) => acc + e, 0) / testSize;
  const rmse = Math.sqrt(errors.reduce((acc, e) => acc + e * e, 0) / testSize);
  
  const meanActuals = actualsOnTest.reduce((acc, v) => acc + v, 0) / testSize;
  const totalSumOfSquares = actualsOnTest.reduce((acc, v) => acc + Math.pow(v - meanActuals, 2), 0);
  const residualSumOfSquares = errors.reduce((acc, e) => acc + e * e, 0);
  const rSquared = 1 - (residualSumOfSquares / totalSumOfSquares);

  // Simulate accuracy and F1 score based on error percentage
  const meanAbsolutePercentageError = (absErrors.reduce((acc, e, i) => acc + e / actualsOnTest[i], 0) / testSize);
  const accuracy = 1 - meanAbsolutePercentageError;
  const f1Score = accuracy * (1 - (modelNoiseFactor / 2)); // F1 is often slightly lower than accuracy

  // Generate simulated confusion matrix data
  const totalPredictions = testSize * 10; // Simulate more data points
  const truePositive = Math.round(totalPredictions * accuracy * 0.7);
  const falseNegative = Math.round(totalPredictions * (1 - accuracy) * 0.4);
  const trueNegative = Math.round(totalPredictions * accuracy * 0.3);
  const falsePositive = totalPredictions - truePositive - falseNegative - trueNegative;

  // Generate ROC-AUC score
  const rocAucScore = Math.min(0.99, Math.max(0.5, accuracy + 0.1 + (Math.random() * 0.1 - 0.05)));

  // Generate feature importance data
  const features = ['Historical Sales', 'Seasonal Trend', 'Market Conditions', 'Price Factor', 'Competition'];
  const featureImportance = features.map(feature => ({
    feature,
    importance: Math.random() * 0.8 + 0.2, // Random importance between 0.2 and 1.0
  })).sort((a, b) => b.importance - a.importance);

  // 5. FINAL PREDICTION (using all historical data)
  const fullTrendSlope = historicalData.length > 1 ? (historicalData[historicalData.length - 1].sales - historicalData[0].sales) / (historicalData.length - 1) : 0;
  const avgSales = historicalData.reduce((acc, d) => acc + d.sales, 0) / historicalData.length;
  
  const forecastMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const forecastData = forecastMonths.map((month, i) => {
    const trendValue = historicalData[historicalData.length-1].sales + fullTrendSlope * (i + 1);
    const seasonalValue = avgSales * 0.15 * Math.sin((Math.PI * i) / (forecastMonths.length -1)); // Add some seasonality
    const randomNoise = (Math.random() - 0.5) * (avgSales * modelNoiseFactor);
    const prediction = Math.max(0, Math.round(trendValue + seasonalValue + randomNoise));
    return { month, predicted: prediction };
  });

  const chartData: PredictDemandFromCsvOutput['chartData'] = [
    ...historicalData.map(d => ({ month: d.month, historical: d.sales, predicted: 0 })),
    ...forecastData.map(d => ({ month: d.month, historical: 0, predicted: d.predicted })),
  ];
  if (chartData.length > historicalData.length && historicalData.length > 0) {
    chartData[historicalData.length-1].predicted = chartData[historicalData.length-1].historical;
  }
  
  const predictedUnits = forecastData.reduce((sum, item) => sum + item.predicted, 0);
  const salesTrend = fullTrendSlope > 0 ? 'Increasing' : 'Decreasing';
  const peak = forecastData.reduce((max, item) => item.predicted > max.predicted ? item : max, forecastData[0] || { month: 'N/A', predicted: 0 });

  const summary = `Based on a simulated ${model} model trained on your data, the forecast suggests a ${salesTrend.toLowerCase()} trend. The model's performance on a held-out test set achieved an accuracy of ${(accuracy*100).toFixed(0)}%. We predict total sales of ${predictedUnits.toLocaleString()} units over the next period, with demand peaking in ${peak.month}.`;

  return {
    summary,
    predictedUnits,
    confidence,
    salesTrend,
    peakDemandPeriod: peak.month,
    chartData,
    modelUsed: `Simulated ${model}`,
    accuracy: Math.max(0, Math.min(1, accuracy)),
    f1Score: Math.max(0, Math.min(1, f1Score)),
    mae: Math.round(mae),
    rmse: Math.round(rmse),
    rSquared: Math.max(0, Math.min(1, rSquared)),
    confusionMatrix: {
      truePositive,
      falsePositive,
      trueNegative,
      falseNegative,
    },
    rocAucScore: Math.round(rocAucScore * 1000) / 1000,
    featureImportance,
  };
}
