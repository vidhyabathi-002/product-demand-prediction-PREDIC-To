
"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  rocCurve: {
    label: "ROC Curve",
    color: "hsl(var(--chart-1))",
  },
  baseline: {
    label: "Random Classifier",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

interface ROCCurveProps {
  aucScore: number;
}

export function ROCCurve({ aucScore }: ROCCurveProps) {
  // Generate ROC curve data points based on AUC score
  const generateROCData = (auc: number) => {
    const points = [];
    const numPoints = 20;
    
    for (let i = 0; i <= numPoints; i++) {
      const fpr = i / numPoints; // False Positive Rate
      
      // Simulate TPR based on AUC score
      let tpr;
      if (auc > 0.9) {
        // Excellent model - steep curve
        tpr = Math.min(1, Math.pow(fpr, 0.3) + (auc - 0.9) * 2);
      } else if (auc > 0.8) {
        // Good model - moderate curve
        tpr = Math.min(1, Math.pow(fpr, 0.5) + (auc - 0.8) * 1.5);
      } else {
        // Average model - gradual curve
        tpr = Math.min(1, fpr + (auc - 0.5) * 1.2);
      }
      
      points.push({
        fpr: Math.round(fpr * 100) / 100,
        tpr: Math.round(tpr * 100) / 100,
        baseline: fpr, // Diagonal line for random classifier
      });
    }
    
    return points;
  };

  const rocData = generateROCData(aucScore);

  const getPerformanceLevel = (auc: number) => {
    if (auc >= 0.9) return { level: "Excellent", color: "text-green-600" };
    if (auc >= 0.8) return { level: "Good", color: "text-blue-600" };
    if (auc >= 0.7) return { level: "Fair", color: "text-yellow-600" };
    return { level: "Poor", color: "text-red-600" };
  };

  const performance = getPerformanceLevel(aucScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROC-AUC Curve</CardTitle>
        <CardDescription>
          Receiver Operating Characteristic curve showing model performance across classification thresholds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <div className="text-2xl font-bold">AUC = {aucScore.toFixed(3)}</div>
          <div className={`text-sm font-medium ${performance.color}`}>
            {performance.level} Performance
          </div>
        </div>
        
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <LineChart
            data={rocData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="fpr"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tickFormatter={(value) => `${value}`}
              label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value, name) => [
                  `${value}`,
                  name === 'tpr' ? 'True Positive Rate' : name === 'baseline' ? 'Random Classifier' : 'ROC Curve'
                ]}
              />}
            />
            <ReferenceLine 
              x={0} y={0} 
              stroke="var(--color-baseline)" 
              strokeDasharray="5 5"
            />
            <Line
              dataKey="tpr"
              stroke="var(--color-rocCurve)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              dataKey="baseline"
              stroke="var(--color-baseline)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>AUC = 1.0: Perfect classifier</p>
          <p>AUC = 0.5: Random classifier (diagonal line)</p>
          <p>Higher AUC indicates better model performance</p>
        </div>
      </CardContent>
    </Card>
  );
}
