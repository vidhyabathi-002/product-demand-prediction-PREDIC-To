
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '../ui/scroll-area';

interface DataPreviewProps {
  csvData: string;
}

export function DataPreview({ csvData }: DataPreviewProps) {
  const { header, rows } = useMemo(() => {
    const lines = csvData.trim().split('\n');
    if (lines.length < 1) return { header: [], rows: [] };

    const header = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1, 101).map(line => line.split(',').map(cell => cell.trim())); // Preview first 100 rows
    return { header, rows };
  }, [csvData]);

  if (!header.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processed Data Preview</CardTitle>
        <CardDescription>
          Showing the first {rows.length} rows of your cleaned dataset.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                    <TableRow>
                        {header.map((colName) => (
                        <TableHead key={colName}>{colName}</TableHead>
                        ))}
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <TableCell key={`${rowIndex}-${cellIndex}`}>{cell}</TableCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
