
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface ColumnInfo {
  name: string;
  dataType: string;
  missingValues: number;
  missingPercentage: number;
  status: string;
}

export function ColumnInformation({ columns }: { columns: ColumnInfo[] }) {
    
  const getStatusBadge = (status: string) => {
    if (status.includes('Missing')) {
      return <Badge variant="destructive">Some Missing</Badge>;
    }
    return <Badge variant="secondary">OK</Badge>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Column Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column Name</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Missing Values</TableHead>
                <TableHead>Missing %</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columns.map((col) => (
                <TableRow key={col.name}>
                  <TableCell className="font-medium">{col.name}</TableCell>
                  <TableCell className="text-muted-foreground">{col.dataType}</TableCell>
                  <TableCell className="text-muted-foreground">{col.missingValues}</TableCell>
                  <TableCell className="text-muted-foreground">{col.missingPercentage.toFixed(2)}%</TableCell>
                  <TableCell>{getStatusBadge(col.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
