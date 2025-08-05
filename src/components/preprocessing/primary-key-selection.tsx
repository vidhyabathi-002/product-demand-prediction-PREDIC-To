
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeyRound } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PrimaryKeySelectionProps {
  columns: string[];
  onSelect: (column: string) => void;
}

export function PrimaryKeySelection({ columns, onSelect }: PrimaryKeySelectionProps) {
    const { toast } = useToast();

    const handleSelect = (value: string) => {
        onSelect(value);
        toast({
            title: "Primary Key Selected",
            description: `You have selected "${value}" as the primary key.`,
        });
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            Select Primary Key
        </CardTitle>
        <CardDescription>
          Choose the column that uniquely identifies each row (e.g., a date or timestamp column for time-series data).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="w-full md:w-1/2">
            <SelectValue placeholder="Select a column..." />
          </SelectTrigger>
          <SelectContent>
            {columns.map((colName) => (
              <SelectItem key={colName} value={colName}>
                {colName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
