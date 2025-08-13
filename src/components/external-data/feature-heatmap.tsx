
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureHeatmapProps {
  data: Array<{
    feature: string;
    importance: number;
  }>;
}

export function FeatureHeatmap({ data }: FeatureHeatmapProps) {
  const getHeatmapColor = (importance: number) => {
    const intensity = Math.round(importance * 10);
    const colors = [
      "bg-blue-50 text-gray-700",     // 0-0.1
      "bg-blue-100 text-gray-700",   // 0.1-0.2
      "bg-blue-200 text-gray-800",   // 0.2-0.3
      "bg-blue-300 text-gray-800",   // 0.3-0.4
      "bg-blue-400 text-white",      // 0.4-0.5
      "bg-blue-500 text-white",      // 0.5-0.6
      "bg-blue-600 text-white",      // 0.6-0.7
      "bg-blue-700 text-white",      // 0.7-0.8
      "bg-blue-800 text-white",      // 0.8-0.9
      "bg-blue-900 text-white",      // 0.9-1.0
      "bg-blue-950 text-white",      // 1.0
    ];
    return colors[Math.min(intensity, 10)];
  };

  const maxImportance = Math.max(...data.map(d => d.importance));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Importance Heatmap</CardTitle>
        <CardDescription>
          Visualization of how much each feature contributes to the model's predictions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.feature} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{item.feature}</span>
                <span className="text-muted-foreground">
                  {(item.importance * 100).toFixed(1)}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8 flex items-center px-3">
                  <div
                    className={`h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${getHeatmapColor(item.importance)}`}
                    style={{ width: `${(item.importance / maxImportance) * 100}%`, minWidth: '60px' }}
                  >
                    {(item.importance * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="grid grid-cols-5 gap-1 text-xs">
            <div className="text-center">
              <div className="bg-blue-100 h-4 rounded mb-1"></div>
              <span>Low</span>
            </div>
            <div className="text-center">
              <div className="bg-blue-300 h-4 rounded mb-1"></div>
              <span></span>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 h-4 rounded mb-1"></div>
              <span>Medium</span>
            </div>
            <div className="text-center">
              <div className="bg-blue-700 h-4 rounded mb-1"></div>
              <span></span>
            </div>
            <div className="text-center">
              <div className="bg-blue-900 h-4 rounded mb-1"></div>
              <span>High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
