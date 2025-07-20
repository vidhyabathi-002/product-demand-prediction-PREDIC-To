"use client";

import type { ReactNode } from "react";

export default function AnalyticsClient({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Analyze market and social data to refine your forecasts.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
