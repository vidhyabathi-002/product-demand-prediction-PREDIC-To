
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, ThumbsUp, ThumbsDown, User, TrendingUp, TrendingDown } from "lucide-react";
import { socialSentimentAnalysis, type SocialSentimentAnalysisOutput } from "@/ai/flows/social-sentiment-analysis";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { SentimentChart } from "./sentiment-chart";

const initialPosts = `- @user1: Just got the new AlphaPhone! The camera is insane, best photos I've ever taken. #alphaphone #tech
- @user2: I'm so disappointed with the AlphaPhone's battery life. It barely lasts half a day. Thinking of returning it.
- @user3: Is anyone else's AlphaPhone overheating? Mine gets really hot when I play games on it.
- @user4: Loving the sleek design of the AlphaPhone. It feels so premium in hand!
- @user5: The software on the AlphaPhone is a bit buggy, but customer support was helpful. #mixedfeelings
- @user6: Just a phone. Does what it says on the tin. Nothing special.`;

export function SocialSentimentCard() {
  const [productName, setProductName] = useState("AlphaPhone");
  const [currentForecast, setCurrentForecast] = useState("50000");
  const [socialMediaPosts, setSocialMediaPosts] = useState(initialPosts);
  const [analysisResult, setAnalysisResult] = useState<SocialSentimentAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysisResult(null);
    try {
      const forecastNumber = parseInt(currentForecast, 10);
      if (isNaN(forecastNumber)) {
        toast({
          variant: "destructive",
          title: "Invalid Input",
          description: "Current forecast must be a number.",
        });
        setLoading(false);
        return;
      }

      const result = await socialSentimentAnalysis({
        productName,
        currentForecast: forecastNumber,
        socialMediaPosts,
      });
      setAnalysisResult(result);
       if (result.sentiment === 'Negative') {
        toast({
            variant: 'warning',
            title: 'Negative Sentiment Detected',
            description: 'Social media sentiment is currently negative. Monitor closely.'
        });
      }
    } catch (error) {
      console.error("Sentiment analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not get a sentiment analysis from the AI model.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: SocialSentimentAnalysisOutput['sentiment']) => {
    switch (sentiment) {
        case 'Positive':
            return <ThumbsUp className="h-6 w-6 text-green-500" />;
        case 'Negative':
            return <ThumbsDown className="h-6 w-6 text-red-500" />;
        case 'Mixed':
             return <div className="flex"><ThumbsUp className="h-5 w-5 text-green-500" /><ThumbsDown className="h-5 w-5 text-red-500" /></div>;
        default:
            return <User className="h-6 w-6 text-muted-foreground" />;
    }
  }

  const getForecastIcon = (current: number, revised: number) => {
    if (revised > current) {
      return <TrendingUp className="h-6 w-6 text-green-500" />;
    }
    if (revised < current) {
      return <TrendingDown className="h-6 w-6 text-red-500" />;
    }
    return <TrendingUp className="h-6 w-6 text-muted-foreground" />;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquareQuote className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle>Social Sentiment Analysis</CardTitle>
              <CardDescription>
                Use AI to analyze social media data and refine demand forecasts.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-forecast">Current Forecast</Label>
              <Input
                id="current-forecast"
                type="number"
                value={currentForecast}
                onChange={(e) => setCurrentForecast(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2 flex-grow flex flex-col">
            <Label htmlFor="social-media-posts">Social Media Posts Data</Label>
            <Textarea
              id="social-media-posts"
              className="min-h-[200px] flex-grow resize-none"
              value={socialMediaPosts}
              onChange={(e) => setSocialMediaPosts(e.target.value)}
            />
          </div>
          <div>
            <Button onClick={handleAnalyze} disabled={loading} className="w-full">
              {loading ? "Analyzing..." : "Analyze Sentiment"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
          {loading && <AnalysisSkeleton />}
          
          {analysisResult && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <Card className="p-4 sm:col-span-1">
                          <div className="flex items-center gap-3">
                              {getSentimentIcon(analysisResult.sentiment)}
                              <p className="font-semibold text-muted-foreground">Overall Sentiment</p>
                          </div>
                          <p className="text-2xl font-bold mt-2">{analysisResult.sentiment}</p>
                      </Card>
                      <Card className="p-4 sm:col-span-1">
                          <div className="flex items-center gap-3">
                              {getForecastIcon(parseInt(currentForecast, 10), analysisResult.revisedForecast)}
                              <p className="font-semibold text-muted-foreground">Revised Forecast</p>
                          </div>
                          <p className="text-2xl font-bold mt-2">{analysisResult.revisedForecast.toLocaleString()}</p>
                      </Card>
                      <SentimentChart data={analysisResult.sentimentDistribution} />
                  </div>
                  <Card>
                      <CardHeader>
                          <CardTitle className="text-base">Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                      </CardContent>
                  </Card>
              </div>
          )}
      </div>
    </div>
  );
}


function AnalysisSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="p-4 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-16" />
                </Card>
                <Card className="p-4 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-16" />
                </Card>
                <Card className="p-4 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-full" />
                </Card>
            </div>
            <Card>
                <CardHeader>
                     <Skeleton className="h-5 w-20" />
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardContent>
            </Card>
        </div>
    )
}

    
