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
import { Pie, PieChart, Cell } from "recharts";
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
} satisfies ChartConfig;

const COLORS = {
  positive: "var(--color-positive)",
  negative: "var(--color-negative)",
  neutral: "var(--color-neutral)",
};

export function SentimentChart({ data }: { data: ChartData }) {
  const chartData = [
    { name: "positive", value: data.positive, fill: COLORS.positive },
    { name: "negative", value: data.negative, fill: COLORS.negative },
    { name: "neutral", value: data.neutral, fill: COLORS.neutral },
  ].filter(d => d.value > 0);

  return (
    <Card className="flex flex-col sm:col-span-1">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sentiment Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              strokeWidth={5}
            >
               {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium leading-none">
          Post Sentiment Breakdown
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Based on analyzed social media posts
        </div>
      </CardFooter>
    </Card>
  );
}
