// src/components/admin/activity-log-client.tsx
"use client";

import { useActivityLog } from "@/context/activity-log-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function ActivityLogClient() {
  const { logs } = useActivityLog();

  const getActionBadge = (action: string) => {
    if (action.includes('Update') || action.includes('Change')) {
      return <Badge variant="secondary">Update</Badge>
    }
    if (action.includes('Status')) {
        return <Badge variant="default" className="bg-blue-500/20 text-blue-700 border-blue-400">Status</Badge>
    }
    return <Badge>{action}</Badge>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>A log of recent user and admin activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No activities logged yet.
                        </TableCell>
                    </TableRow>
                )}
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{log.timestamp}</TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
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
