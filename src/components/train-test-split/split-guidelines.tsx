
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, HelpCircle, Columns3, CheckCircle2 } from 'lucide-react';
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
            <Lightbulb className="w-5 h-5 text-primary" />
            Split Guidelines
        </CardTitle>
        <CardDescription>Tips for effective data splitting.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-blue-500" />Why Split Data?</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Splitting data into training and testing sets is crucial for evaluating a model's performance on unseen data, which helps prevent overfitting.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><Columns3 className="w-4 h-4 text-purple-500" />Choosing a Split Ratio</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             A common split is 80% for training and 20% for testing. For very large datasets, you might use a 90/10 or even 99/1 split.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" />Target Column</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             The target column (or 'y' variable) is what you want to predict. For sales forecasting, this would typically be 'Sales' or 'Revenue'.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
