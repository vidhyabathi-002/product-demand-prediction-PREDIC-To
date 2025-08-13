
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ConfusionMatrixProps {
  data: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
}

export function ConfusionMatrix({ data }: ConfusionMatrixProps) {
  const { truePositive, falsePositive, trueNegative, falseNegative } = data;
  const total = truePositive + falsePositive + trueNegative + falseNegative;

  const getIntensity = (value: number) => {
    const percentage = value / total;
    if (percentage > 0.4) return "bg-blue-700 text-white";
    if (percentage > 0.2) return "bg-blue-500 text-white";
    if (percentage > 0.1) return "bg-blue-300 text-gray-900";
    return "bg-blue-100 text-gray-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confusion Matrix</CardTitle>
        <CardDescription>
          Model prediction accuracy breakdown showing true vs predicted classifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {/* Headers */}
          <div></div>
          <div className="text-center font-semibold text-sm text-muted-foreground">
            Predicted Positive
          </div>
          <div className="text-center font-semibold text-sm text-muted-foreground">
            Predicted Negative
          </div>
          
          {/* Actual Positive Row */}
          <div className="text-center font-semibold text-sm text-muted-foreground self-center">
            Actual Positive
          </div>
          <div className={`p-4 rounded text-center font-bold ${getIntensity(truePositive)}`}>
            <div className="text-lg">{truePositive}</div>
            <div className="text-xs opacity-80">True Positive</div>
          </div>
          <div className={`p-4 rounded text-center font-bold ${getIntensity(falseNegative)}`}>
            <div className="text-lg">{falseNegative}</div>
            <div className="text-xs opacity-80">False Negative</div>
          </div>
          
          {/* Actual Negative Row */}
          <div className="text-center font-semibold text-sm text-muted-foreground self-center">
            Actual Negative
          </div>
          <div className={`p-4 rounded text-center font-bold ${getIntensity(falsePositive)}`}>
            <div className="text-lg">{falsePositive}</div>
            <div className="text-xs opacity-80">False Positive</div>
          </div>
          <div className={`p-4 rounded text-center font-bold ${getIntensity(trueNegative)}`}>
            <div className="text-lg">{trueNegative}</div>
            <div className="text-xs opacity-80">True Negative</div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Total Predictions: {total.toLocaleString()}</p>
          <p>Accuracy: {(((truePositive + trueNegative) / total) * 100).toFixed(1)}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
