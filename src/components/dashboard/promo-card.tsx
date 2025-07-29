
'use client';

import { useState } from "react";
import { generatePromotionalText } from "@/ai/flows/generate-promotional-text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

export function PromoCard() {
  const [promotionalText, setPromotionalText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setPromotionalText("");
    try {
      const result = await generatePromotionalText({
        predictedDemand: "High",
        targetDemographics: "Young Professionals & Tech Enthusiasts",
        productDescription:
          "A new sleek and powerful laptop with a 12-hour battery life, 4K display, and AI-powered productivity features.",
      });
      setPromotionalText(result.promotionalText);
      toast({
        variant: 'info',
        title: 'Promotion Generated',
        description: 'AI-generated promotional text is ready.'
      });
    } catch (error) {
      console.error("Failed to generate promotional text:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not get a promotional idea from the AI model.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>Promotional Ideas</CardTitle>
            <CardDescription>
              Use AI to generate marketing copy based on your product data.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
            <div className="space-y-2 text-sm p-4 bg-muted/50 rounded-lg border">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}

        {!loading && promotionalText && (
          <div className="text-sm p-4 bg-muted/50 rounded-lg border">
            {promotionalText}
          </div>
        )}

        {!loading && !promotionalText && (
            <div className="text-sm text-center p-4 bg-muted/20 text-muted-foreground rounded-lg border border-dashed">
                Click the button to generate a promotional idea.
            </div>
        )}

        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Generate New Idea"}
        </Button>
      </CardContent>
    </Card>
  );
}
