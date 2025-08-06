
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Shuffle, GitCommitHorizontal, Timer, Layers } from 'lucide-react';
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
                <div className="flex items-center gap-2"><Shuffle className="w-4 h-4 text-purple-500" />Random Split</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Randomly shuffles data before splitting. Good for general-purpose datasets where observation order doesn't matter.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-500" />Stratified Split</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Maintains the original distribution of the target variable in both train and test sets. Essential for imbalanced classification tasks.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><Timer className="w-4 h-4 text-green-500" />Time-Based Split</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Splits data chronologically without shuffling. Crucial for time-series forecasting to prevent data leakage from the future.
            </AccordionContent>
          </AccordionItem>
           <AccordionItem value="item-4">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><GitCommitHorizontal className="w-4 h-4 text-amber-500" />Split Ratio</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Common splits are 80/20 or 70/30. Larger datasets can sometimes use a smaller test set (e.g., 90/10).
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
