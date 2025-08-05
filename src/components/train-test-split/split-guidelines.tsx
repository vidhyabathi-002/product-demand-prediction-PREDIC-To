
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Shuffle, GitCommitHorizontal, Timer } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function SplitGuidelines() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Split Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><Target className="w-4 h-4 text-amber-500" />Target Selection</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Choose the climate variable you want to predict as your target column.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><GitCommitHorizontal className="w-4 h-4 text-blue-500" />Split Ratio</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Common splits are 80/20 or 70/30. Larger datasets can use smaller test ratios.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><Shuffle className="w-4 h-4 text-purple-500" />Random State</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Use the same random state for reproducible experiments.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><Timer className="w-4 h-4 text-green-500" />Time Series</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             For time series data, consider chronological splits instead of random.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
