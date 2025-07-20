
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

export default function ReportClient() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 5, 20),
        to: addDays(new Date(2025, 5, 20), 30),
      })

  return (
    <div className="space-y-6">
       <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and view reports for your business.</p>
      </div>
      <Card className="bg-secondary/50">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>
            Select your desired report type and date range.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-2">
                <label className="text-sm font-medium">Report Type</label>
                 <Select defaultValue="sales-summary">
                    <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sales-summary">Sales Summary</SelectItem>
                        <SelectItem value="demand-forecast">Demand Forecast</SelectItem>
                        <SelectItem value="customer-segmentation">Customer Segmentation</SelectItem>
                    </SelectContent>
                 </Select>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">Date range</label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "justify-start text-left font-normal bg-card",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
            </div>
            <Button size="lg">
                <Download className="mr-2 h-4 w-4" />
                Generate and Download
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
