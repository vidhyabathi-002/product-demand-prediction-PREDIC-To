import { generatePromotionalText } from "@/ai/flows/generate-promotional-text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export async function PromoCard() {
  const result = await generatePromotionalText({
    predictedDemand: "High",
    targetDemographics: "Young Professionals & Tech Enthusiasts",
    productDescription:
      "A new sleek and powerful laptop with a 12-hour battery life, 4K display, and AI-powered productivity features.",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>Promotional Ideas</CardTitle>
            <CardDescription>AI-generated marketing copy</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
         <div className="text-sm p-4 bg-muted/50 rounded-lg border">
            {result.promotionalText}
         </div>
      </CardContent>
    </Card>
  );
}
