'use server';

/**
 * @fileOverview Segments potential customers based on predicted demand patterns and behavior.
 *
 * - customerSegmentation - Segments potential customers based on predicted demand patterns and behavior.
 * - CustomerSegmentationInput - The input type for the customerSegmentation function.
 * - CustomerSegmentationOutput - The return type for the customerSegmentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerSegmentationInputSchema = z.object({
  customerData: z.string().describe('Customer data including demographics, purchase history, and browsing behavior.'),
  marketTrends: z.string().describe('Current market trends and competitor analysis.'),
  productDetails: z.string().describe('Details about the product including features, pricing, and target audience.'),
});
export type CustomerSegmentationInput = z.infer<typeof CustomerSegmentationInputSchema>;

const CustomerSegmentationOutputSchema = z.object({
  segments: z.array(
    z.object({
      segmentName: z.string().describe('Name of the customer segment.'),
      description: z.string().describe('Detailed description of the customer segment.'),
      characteristics: z.array(z.string()).describe('Key characteristics of the customer segment.'),
      suggestedStrategies: z.array(z.string()).describe('Marketing and product development strategies tailored to the segment.'),
    })
  ).describe('Array of customer segments with descriptions, characteristics, and suggested strategies.'),
});
export type CustomerSegmentationOutput = z.infer<typeof CustomerSegmentationOutputSchema>;

export async function customerSegmentation(input: CustomerSegmentationInput): Promise<CustomerSegmentationOutput> {
  return customerSegmentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerSegmentationPrompt',
  input: {schema: CustomerSegmentationInputSchema},
  output: {schema: CustomerSegmentationOutputSchema},
  prompt: `You are an expert marketing analyst specializing in customer segmentation.

  Given the following customer data, market trends, and product details, identify distinct customer segments and suggest tailored marketing and product development strategies for each segment.

  Customer Data: {{{customerData}}}
  Market Trends: {{{marketTrends}}}
  Product Details: {{{productDetails}}}

  Based on this information, segment potential customers and provide a description, key characteristics, and suggested strategies for each segment.
  `,
});

const customerSegmentationFlow = ai.defineFlow(
  {
    name: 'customerSegmentationFlow',
    inputSchema: CustomerSegmentationInputSchema,
    outputSchema: CustomerSegmentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
