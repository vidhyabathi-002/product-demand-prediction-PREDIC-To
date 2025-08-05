
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, TestTube2, DatabaseZap, ArrowRight } from 'lucide-react';
import { DataOverview, type DataStats } from './data-overview';
import { ColumnInformation, type ColumnInfo } from './column-information';
import { PrimaryKeySelection } from './primary-key-selection';
import { Configuration, type MissingValueStrategy } from './configuration';
import { useRouter } from 'next/navigation';
import { DataPreview } from './data-preview';


export type PreprocessingData = {
    stats: DataStats;
    columns: ColumnInfo[];
    csvData: string;
};

export default function PreprocessingClient() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [originalData, setOriginalData] = useState<PreprocessingData | null>(null);
  const [processedData, setProcessedData] = useState<PreprocessingData | null>(null);
  const [primaryKey, setPrimaryKey] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const analyzeCsv = (csvString: string, name: string): PreprocessingData => {
      const lines = csvString.trim().split('\n');
      if (lines.length <= 1) {
          return {
              stats: { rows: 0, columns: 0, missing: 0, duplicates: 0, fileName: name },
              columns: [],
              csvData: csvString,
          }
      }

      const header = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1);

      const stats: DataStats = {
          rows: rows.length,
          columns: header.length,
          missing: 0,
          duplicates: 0,
          fileName: name
      };

      const columns: ColumnInfo[] = header.map(h => ({
          name: h,
          dataType: 'object',
          missingValues: 0,
          missingPercentage: 0,
          status: 'OK'
      }));

      const columnMissingCount: { [key: number]: number } = {};
      let columnsWithMissing = 0;

      rows.forEach(line => {
          const values = line.split(',');
          let hasMissingValueInRow = false;
          values.forEach((val, i) => {
              if (i < header.length && (!val || val.trim() === '')) {
                  if(!columnMissingCount[i]) columnMissingCount[i] = 0;
                  columnMissingCount[i]++;
                  hasMissingValueInRow = true;
              }
          });
      });

      Object.values(columnMissingCount).forEach(count => {
          if (count > 0) columnsWithMissing++;
      });
      stats.missing = columnsWithMissing;

      columns.forEach((col, i) => {
          const missingCount = columnMissingCount[i] || 0;
          col.missingValues = missingCount;
          col.missingPercentage = rows.length > 0 ? (missingCount / rows.length) * 100 : 0;
          if (missingCount > 0) {
              col.status = 'Some Missing';
          }
      });
      
       // Check for duplicate rows
      const rowSet = new Set(rows);
      stats.duplicates = rows.length - rowSet.size;


      return { stats, columns, csvData: csvString };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setPrimaryKey(null); // Reset primary key on new file
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const analysis = analyzeCsv(text, selectedFile.name);
            setOriginalData(analysis);
            setProcessedData(analysis); // Initially, processed is same as original
            setIsProcessed(false); // Reset processed state
        };
        reader.readAsText(selectedFile);
        toast({
            variant: 'success',
            title: 'File Uploaded',
            description: `${selectedFile.name} uploaded successfully.`
        });

      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a CSV file.',
        });
      }
    }
  };

  const loadSampleData = async () => {
    try {
        const response = await fetch('/sample-climate-data.csv');
        const text = await response.text();
        const name = "sample-climate-data.csv";
        setFile(new File([text], name, { type: "text/csv" }));
        setFileName(name);
        setPrimaryKey(null);
        const analysis = analyzeCsv(text, name);
        setOriginalData(analysis);
        setProcessedData(analysis);
        setIsProcessed(false);
         toast({
          title: 'Sample Data Loaded',
          description: 'The sample climate data has been loaded and analyzed.',
        });
    } catch (error) {
         toast({
          variant: 'destructive',
          title: 'Failed to Load Sample',
          description: 'Could not load the sample dataset.',
        });
    }
  }

  const handleStartPreprocessing = async (strategy: MissingValueStrategy) => {
    if (!originalData) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time

    let finalCsvData = originalData.csvData;

    if (strategy === 'drop') {
      const lines = originalData.csvData.trim().split('\n');
      const header = lines[0];
      const dataRows = lines.slice(1);
      const cleanedRows = dataRows.filter(row => {
        const values = row.split(',');
        // Ensure the row has the same number of columns as the header, and no value is empty
        return values.length === header.split(',').length && values.every(val => val && val.trim() !== '');
      });
      finalCsvData = [header, ...cleanedRows].join('\n');
    }

    const finalAnalysis = analyzeCsv(finalCsvData, originalData.stats.fileName);
    setProcessedData(finalAnalysis);
    sessionStorage.setItem('preprocessedData', JSON.stringify(finalAnalysis));
    setIsProcessed(true);

    toast({
        title: "Preprocessing Complete",
        description: `Data processed using '${strategy}' strategy. You can now proceed to forecasting.`
    });
    
    setLoading(false);
  }
  
  const displayData = isProcessed ? processedData : originalData;

  return (
    <div className="space-y-6">
       <div className="space-y-1">
        <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <DatabaseZap className="w-6 h-6 text-primary" />
            </div>
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">Data Preprocessing</h1>
                <p className="text-muted-foreground">
                Clean, transform, and prepare your data for machine learning.
                </p>
            </div>
        </div>
      </div>
        <Card>
          <CardHeader>
            <CardTitle>Select Dataset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
                <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                <Button asChild variant="outline" className="w-full sm:w-auto">
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>{fileName || 'Upload New Dataset'}</span>
                    </label>
                </Button>
                <Button onClick={loadSampleData} variant="secondary" title="Load Sample Data">
                    <TestTube2 className="h-4 w-4 mr-2" />
                    Load Sample
                </Button>
            </div>
          </CardContent>
        </Card>

        {displayData && (
            <div className='space-y-6'>
                <DataOverview stats={displayData.stats} />
                <ColumnInformation columns={displayData.columns} />
                <PrimaryKeySelection 
                  columns={displayData.columns.map(c => c.name)} 
                  onSelect={setPrimaryKey}
                />
                
                {primaryKey && (
                  <Configuration onStart={handleStartPreprocessing} isLoading={loading} />
                )}

                {isProcessed && processedData && (
                    <>
                    <DataPreview csvData={processedData.csvData} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Ready for Next Step</CardTitle>
                            <CardDescription>
                                Your data has been successfully preprocessed. You can now move on to the forecasting stage.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button onClick={() => router.push('/external-data')}>
                                Proceed to Forecast
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                    </>
                )}
            </div>
        )}
    </div>
  );
}
