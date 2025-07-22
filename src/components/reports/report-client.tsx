
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileWarning, Download, UploadCloud } from 'lucide-react';
import type { PredictDemandFromCsvOutput } from '@/ai/flows/predict-demand-from-csv';
import { GeneratedReport } from './generated-report';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/notification-context';
import { useUser } from '@/context/user-context';
import { useActivityLog } from '@/context/activity-log-context';

export default function ReportClient() {
    const [reportData, setReportData] = useState<PredictDemandFromCsvOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { addNotification } = useNotification();
    const { user } = useUser();
    const { addLog } = useActivityLog();
    
    useEffect(() => {
        const data = sessionStorage.getItem('predictionReport');
        if (data) {
            try {
                setReportData(JSON.parse(data));
            } catch (error) {
                console.error("Failed to parse report data from session storage", error);
                setReportData(null);
            }
        }
        setLoading(false);
    }, []);

    const handlePrint = () => {
      window.print();
      addNotification({
          title: 'Report Downloaded',
          message: 'The demand forecast report has been sent to your printer.',
      });
      if (user) {
        addLog({
            user: user.name,
            action: 'Download Report',
            details: 'Downloaded the demand forecast report.'
        })
      }
    }

  if (loading) {
    return (
       <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generating report...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generated demand forecast report.</p>
        </div>
        {reportData && (
             <Button size="lg" onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
            </Button>
        )}
       </div>

      {reportData ? (
        <GeneratedReport data={reportData} />
      ) : (
        <Card className="bg-secondary/50 no-print">
            <CardHeader>
            <CardTitle className='flex items-center gap-3'>
                <FileWarning className="w-8 h-8 text-amber-500" />
                No Report Data Found
                </CardTitle>
            <CardDescription>
                To generate a report, you first need to analyze a CSV file.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.push('/external-data')}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Go to External Data
                </Button>
            </CardContent>
      </Card>
      )}
    </div>
  );
}
