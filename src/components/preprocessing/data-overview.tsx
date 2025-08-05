
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Database, AlertTriangle, Copy } from 'lucide-react';

export interface DataStats {
  rows: number;
  columns: number;
  missing: number;
  duplicates: number;
  fileName: string;
}

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: number | string, icon: React.ElementType, colorClass?: string }) => (
    <Card className="p-4">
        <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${colorClass || 'text-primary'}`} />
            <div>
                <p className="text-muted-foreground text-sm">{title}</p>
                <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            </div>
        </div>
    </Card>
);

export function DataOverview({ stats }: { stats: DataStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Overview: {stats.fileName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Rows" value={stats.rows} icon={FileText} />
            <StatCard title="Columns" value={stats.columns} icon={Database} />
            <StatCard title="Columns with Missing" value={stats.missing} icon={AlertTriangle} colorClass="text-amber-500" />
            <StatCard title="Duplicate Rows" value={stats.duplicates} icon={Copy} colorClass="text-red-500" />
        </div>
      </CardContent>
    </Card>
  );
}
