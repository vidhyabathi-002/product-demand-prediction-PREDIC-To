// src/components/analytics/sentiment-chart.tsx
"use client";

import { TrendingUp, TrendingDown, CircleHelp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import type { SocialSentimentAnalysisOutput } from "@/ai/flows/social-sentiment-analysis";

type ChartData = SocialSentimentAnalysisOutput['sentimentDistribution'];

const chartConfig = {
  positive: {
    label: "Positive",
    color: "hsl(var(--chart-1))", 
    icon: TrendingUp,
  },
  negative: {
    label: "Negative",
    color: "hsl(var(--chart-2))",
    icon: TrendingDown,
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--muted-foreground))",
    icon: CircleHelp,
  },
  posts: {
    label: "Posts",
  }
} satisfies ChartConfig;

const COLORS = {
  positive: "var(--color-positive)",
  negative: "var(--color-negative)",
  neutral: "var(--color-neutral)",
};

export function SentimentChart({ data }: { data: ChartData }) {
  const totalPosts = data.positive + data.negative + data.neutral;
  
  const chartData = [
    { sentiment: "positive", posts: data.positive, fill: COLORS.positive, percentage: totalPosts > 0 ? Math.round((data.positive / totalPosts) * 100) : 0 },
    { sentiment: "negative", posts: data.negative, fill: COLORS.negative, percentage: totalPosts > 0 ? Math.round((data.negative / totalPosts) * 100) : 0 },
    { sentiment: "neutral", posts: data.neutral, fill: COLORS.neutral, percentage: totalPosts > 0 ? Math.round((data.neutral / totalPosts) * 100) : 0 },
  ];

  return (
    <Card className="flex flex-col sm:col-span-1">
      <CardContent className="flex-1 pb-0 pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 30, // Add more margin for the percentage label
            }}
            accessibilityLayer
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="sentiment"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="posts" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent  hideLabel indicator="line" />}
            />
            <Bar dataKey="posts" layout="vertical" radius={5}>
                 <LabelList 
                    dataKey="percentage" 
                    position="right" 
                    offset={8} 
                    className="fill-foreground text-sm"
                    formatter={(value: number) => `${value}%`}
                />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col gap-1.5 items-center text-sm pt-4 pb-6">
        <CardTitle className="text-base">Sentiment Distribution</CardTitle>
        <CardDescription>Number of posts by sentiment</CardDescription>
      </CardFooter>
    </Card>
  );
}
