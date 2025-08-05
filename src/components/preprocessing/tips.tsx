
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, Scale, Wrench } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Tips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Preprocessing Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" />Missing Values</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Consider the nature of your data when choosing how to handle missing values. Time-series data often benefits from interpolation.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><Scale className="w-4 h-4 text-blue-500" />Scaling</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Scale your data if features have different units (e.g., Temperature vs CO2 levels). This helps most models perform better.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
                <div className="flex items-center gap-2"><Wrench className="w-4 h-4 text-purple-500" />Feature Engineering</div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
             Create interaction features or polynomial features for domain variables that might influence each other.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
