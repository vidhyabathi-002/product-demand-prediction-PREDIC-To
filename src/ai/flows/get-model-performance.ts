
'use server';

/**
 * @fileOverview Retrieves the simulated performance metrics for all available ML models.
 *
 * - getModelPerformance - A function that returns performance data.
 * - ModelPerformance - The type for an individual model's performance data.
 */

import { z } from 'zod';
import type { ModelType } from './predict-demand-from-csv';

const ModelPerformanceSchema = z.object({
  model: z.string().describe('The machine learning model.'),
  accuracy: z.number().describe('The accuracy of the model prediction as a percentage.'),
  f1Score: z.number().describe('The F1 score of the model prediction.'),
});
export type ModelPerformance = z.infer<typeof ModelPerformanceSchema>;


const performanceData: Record<ModelType, { accuracy: number; f1Score: number }> = {
  'ARIMA': { accuracy: 0.85, f1Score: 0.82 },
  'Prophet': { accuracy: 0.92, f1Score: 0.90 },
  'LSTM': { accuracy: 0.88, f1Score: 0.86 },
  'Random Forest': { accuracy: 0.95, f1Score: 0.94 },
  'XGBoost': { accuracy: 0.96, f1Score: 0.95 },
};

/**
 * Simulates fetching performance data for all models.
 * @returns A promise that resolves to an array of model performance data.
 */
export async function getModelPerformance(): Promise<ModelPerformance[]> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return Object.entries(performanceData).map(([model, metrics]) => ({
    model: model as ModelType,
    ...metrics,
  }));
}
