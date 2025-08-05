
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleDashed, Loader } from "lucide-react";

const steps = [
  { name: 'Data Upload', status: 'completed' },
  { name: 'Preprocessing', status: 'pending' },
  { name: 'Train/Test Split', status: 'pending' },
  { name: 'Model Training', status: 'pending' },
];

export function Status() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <CircleDashed className="w-5 h-5 text-muted-foreground" />;
      case 'working':
        return <Loader className="w-5 h-5 text-primary animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
      switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'working':
        return <Badge variant="default">Working</Badge>;
      default:
        return null;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {steps.map((step) => (
            <li key={step.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(step.status)}
                <span className="font-medium">{step.name}</span>
              </div>
              {getStatusBadge(step.status)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
