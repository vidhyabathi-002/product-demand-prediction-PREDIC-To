'use server';

/**
 * @fileOverview Analyzes social media sentiment to refine demand forecasts.
 * 
 * - socialSentimentAnalysis - A function that analyzes social media data.
 * - SocialSentimentAnalysisInput - The input type for the function.
 * - SocialSentimentAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SocialSentimentAnalysisInputSchema = z.object({
  productName: z.string().describe('The name of the product being analyzed.'),
  currentForecast: z.number().describe('The current sales forecast for the product.'),
  socialMediaPosts: z.string().describe('A collection of social media posts about the product.'),
});
export type SocialSentimentAnalysisInput = z.infer<typeof SocialSentimentAnalysisInputSchema>;

const SocialSentimentAnalysisOutputSchema = z.object({
    revisedForecast: z.number().describe('The revised sales forecast based on social media sentiment.'),
    summary: z.string().describe('A summary of the sentiment analysis, highlighting key themes and justification for the revised forecast.'),
    sentiment: z.enum(['Positive', 'Negative', 'Mixed', 'Neutral']).describe('The overall sentiment of the social media posts.'),
    sentimentDistribution: z.object({
      positive: z.number().describe('The number of positive posts.'),
      negative: z.number().describe('The number of negative posts.'),
      neutral: z.number().describe('The number of neutral posts.'),
    }).describe('The distribution of sentiments across all posts.'),
});
export type SocialSentimentAnalysisOutput = z.infer<typeof SocialSentimentAnalysisOutputSchema>;

export async function socialSentimentAnalysis(
  input: SocialSentimentAnalysisInput
): Promise<SocialSentimentAnalysisOutput> {
  return socialSentimentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'socialSentimentAnalysisPrompt',
  input: {schema: SocialSentimentAnalysisInputSchema},
  output: {schema: SocialSentimentAnalysisOutputSchema},
  prompt: `You are a market analyst AI. Your task is to analyze the sentiment of social media posts for a given product and revise the sales forecast based on your findings.

Product Name: {{{productName}}}
Current Forecast: {{{currentForecast}}}
Social Media Posts:
{{{socialMediaPosts}}}

Analyze the sentiment in the posts. Consider the positive and negative comments.
1.  Count the number of posts that are primarily positive, negative, and neutral. Return this in the 'sentimentDistribution' field.
2.  Based on the overall sentiment, revise the current forecast. If sentiment is largely positive, increase the forecast. If it's largely negative, decrease it. If it's mixed, adjust it moderately.
3.  Provide a summary explaining your reasoning, the overall sentiment, and the revised forecast.`,
});

const socialSentimentAnalysisFlow = ai.defineFlow(
  {
    name: 'socialSentimentAnalysisFlow',
    inputSchema: SocialSentimentAnalysisInputSchema,
    outputSchema: SocialSentimentAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
