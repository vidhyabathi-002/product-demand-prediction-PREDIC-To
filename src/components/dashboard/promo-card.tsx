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

  const promotionalTexts = result.promotionalText.split(/\d\.\s/).filter(s => s.trim().length > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle>Promotional Ideas</CardTitle>
            <CardDescription>AI-generated marketing copy</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {promotionalTexts.map((text, index) => (
             <li key={index} className="text-sm p-4 bg-muted/50 rounded-lg border">
                {text.trim()}
             </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
