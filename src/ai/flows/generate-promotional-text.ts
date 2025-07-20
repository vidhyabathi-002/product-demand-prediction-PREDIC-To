// src/ai/flows/generate-promotional-text.ts
'use server';

/**
 * @fileOverview Generates promotional text variations based on predicted demand and target demographics.
 *
 * - generatePromotionalText - A function that generates promotional text.
 * - GeneratePromotionalTextInput - The input type for the generatePromotionalText function.
 * - GeneratePromotionalTextOutput - The return type for the generatePromotionalText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePromotionalTextInputSchema = z.object({
  predictedDemand: z
    .string()
    .describe('The predicted demand for the product (e.g., High, Medium, Low).'),
  targetDemographics: z
    .string()
    .describe('The target demographics for the product (e.g., Young Adults, Professionals).'),
  productDescription: z.string().describe('A description of the product.'),
});
export type GeneratePromotionalTextInput = z.infer<
  typeof GeneratePromotionalTextInputSchema
>;

const GeneratePromotionalTextOutputSchema = z.object({
  promotionalText: z
    .string()
    .describe('The generated promotional text variations.'),
});
export type GeneratePromotionalTextOutput = z.infer<
  typeof GeneratePromotionalTextOutputSchema
>;

export async function generatePromotionalText(
  input: GeneratePromotionalTextInput
): Promise<GeneratePromotionalTextOutput> {
  return generatePromotionalTextFlow(input);
}

const generatePromotionalTextPrompt = ai.definePrompt({
  name: 'generatePromotionalTextPrompt',
  input: {schema: GeneratePromotionalTextInputSchema},
  output: {schema: GeneratePromotionalTextOutputSchema},
  prompt: `You are an expert marketing copywriter. Based on the predicted demand, target demographics, and product description, generate compelling promotional text variations.  The variations should be engaging and tailored to the specified audience, while highlighting the product's key features.

Predicted Demand: {{{predictedDemand}}}
Target Demographics: {{{targetDemographics}}}
Product Description: {{{productDescription}}}

Generate three different promotional text options:
1.
2.
3.`,
});

const generatePromotionalTextFlow = ai.defineFlow(
  {
    name: 'generatePromotionalTextFlow',
    inputSchema: GeneratePromotionalTextInputSchema,
    outputSchema: GeneratePromotionalTextOutputSchema,
  },
  async input => {
    const {output} = await generatePromotionalTextPrompt(input);
    return output!;
  }
);
