
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, TestTube2, DatabaseZap, ArrowRight } from 'lucide-react';
import { DataOverview, type DataStats } from './data-overview';
import { ColumnInformation, type ColumnInfo } from './column-information';
import { Configuration, type PreprocessingConfig } from './configuration';
import { useRouter } from 'next/navigation';
import { DataPreview } from './data-preview';
import { useActivityLog } from '@/context/activity-log-context';
import { useUser } from '@/context/user-context';
import { PrimaryKeySelection } from './primary-key-selection';


export type PreprocessingData = {
    stats: DataStats;
    columns: ColumnInfo[];
    csvData: string;
    fileName: string;
};

export default function PreprocessingClient() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [originalData, setOriginalData] = useState<PreprocessingData | null>(null);
  const [processedData, setProcessedData] = useState<PreprocessingData | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { addLog } = useActivityLog();
  const { user } = useUser();
  const [primaryKey, setPrimaryKey] = useState<string>('');


  const analyzeCsv = (csvString: string, name: string): PreprocessingData => {
      const lines = csvString.trim().split('\n');
      if (lines.length <= 1) {
          return {
              stats: { rows: 0, columns: 0, missing: 0, duplicates: 0, fileName: name },
              columns: [],
              csvData: csvString,
              fileName: name,
          }
      }

      const header = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => line.split(','));

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
          line.forEach((val, i) => {
              if (i < header.length && (!val || val.trim() === '')) {
                  if(!columnMissingCount[i]) columnMissingCount[i] = 0;
                  columnMissingCount[i]++;
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
           // Simple data type inference
          const sampleValue = rows.find(r => r[i] && r[i].trim() !== '')?.[i];
          if (sampleValue) {
             if (!isNaN(Number(sampleValue))) {
                 col.dataType = 'number';
             } else if (!isNaN(Date.parse(sampleValue))) {
                 col.dataType = 'date';
             } else {
                 col.dataType = 'string';
             }
          }
      });
      
      const rowSet = new Set(rows.map(r => r.join(',')));
      stats.duplicates = rows.length - rowSet.size;


      return { stats, columns, csvData: [header.join(','), ...rows.map(r=>r.join(','))].join('\n'), fileName: name };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const analysis = analyzeCsv(text, selectedFile.name);
            setOriginalData(analysis);
            setProcessedData(analysis); 
            setIsProcessed(false); 
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
        const response = await fetch('/sample-sales-data.csv');
        const text = await response.text();
        const name = "sample-sales-data.csv";
        setFile(new File([text], name, { type: "text/csv" }));
        setFileName(name);
        const analysis = analyzeCsv(text, name);
        setOriginalData(analysis);
        setProcessedData(analysis);
        setIsProcessed(false);
         toast({
          title: 'Sample Data Loaded',
          description: 'The sample sales data has been loaded and analyzed.',
        });
    } catch (error) {
         toast({
          variant: 'destructive',
          title: 'Failed to Load Sample',
          description: 'Could not load the sample dataset.',
        });
    }
  }

  const handleProcess = async (config: PreprocessingConfig) => {
    if (!originalData) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    let logDetails: string[] = [];
    
    // --- PARSE CSV ---
    const lines = originalData.csvData.trim().split('\n');
    const header = lines[0].split(',').map(h => h.trim());
    let data = lines.slice(1).map(line => line.split(',').map(v => v.trim()));

    // --- 1. REMOVE DUPLICATES ---
    if (config.removeDuplicates) {
        const rowSet = new Set<string>();
        const uniqueData: string[][] = [];
        data.forEach(row => {
            const rowString = row.join(',');
            if (!rowSet.has(rowString)) {
                rowSet.add(rowString);
                uniqueData.push(row);
            }
        });
        if(data.length > uniqueData.length) {
          logDetails.push(`Removed ${data.length - uniqueData.length} duplicate rows.`);
        }
        data = uniqueData;
    }

    // --- 2. HANDLE MISSING VALUES ---
    if (config.missingValueStrategy !== 'none') {
        const columnData: (number | null)[][] = header.map(() => []);
        data.forEach(row => {
            row.forEach((cell, i) => {
                const num = cell === '' ? null : parseFloat(cell);
                if (originalData.columns[i].dataType === 'number') {
                    columnData[i].push(isNaN(num as any) ? null : num);
                }
            });
        });

        if (config.missingValueStrategy === 'drop') {
            data = data.filter(row => row.every(cell => cell !== ''));
            logDetails.push('Dropped rows with missing values.');
        } else {
             header.forEach((_, colIndex) => {
                if(originalData.columns[colIndex].dataType !== 'number') return;
                
                let fillValue: number | undefined;
                const validValues = columnData[colIndex].filter(v => v !== null) as number[];

                if (validValues.length === 0) return; // Cannot impute if all are missing

                if (config.missingValueStrategy === 'mean') {
                    fillValue = validValues.reduce((a, b) => a + b, 0) / validValues.length;
                } else if (config.missingValueStrategy === 'median') {
                    const sorted = [...validValues].sort((a, b) => a - b);
                    const mid = Math.floor(sorted.length / 2);
                    fillValue = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
                }
                
                if (fillValue !== undefined) {
                    data.forEach(row => {
                        if (row[colIndex] === '') {
                            row[colIndex] = fillValue!.toFixed(2);
                        }
                    });
                } else if (config.missingValueStrategy === 'interpolate') {
                     data.forEach((row, rowIndex) => {
                        if (row[colIndex] === '') {
                            let prevVal: number | null = null;
                            let nextVal: number | null = null;
                            // Find previous value
                            for (let i = rowIndex - 1; i >= 0; i--) {
                                if (data[i][colIndex] !== '') { prevVal = parseFloat(data[i][colIndex]); break; }
                            }
                            // Find next value
                            for (let i = rowIndex + 1; i < data.length; i++) {
                                if (data[i][colIndex] !== '') { nextVal = parseFloat(data[i][colIndex]); break; }
                            }
                            if (prevVal !== null && nextVal !== null) {
                                row[colIndex] = ((prevVal + nextVal) / 2).toFixed(2);
                            } else if (prevVal !== null) { // Extrapolate end
                                row[colIndex] = prevVal.toFixed(2);
                            }
                        }
                     });
                }
            });
            logDetails.push(`Filled missing values using ${config.missingValueStrategy}.`);
        }
    }

    // --- 3. HANDLE OUTLIERS ---
    if (config.outlierStrategy !== 'none') {
        header.forEach((_, colIndex) => {
             if(originalData.columns[colIndex].dataType !== 'number') return;
             const values = data.map(r => parseFloat(r[colIndex])).filter(v => !isNaN(v)).sort((a,b) => a-b);
             if(values.length < 4) return;
             
             const q1 = values[Math.floor(values.length / 4)];
             const q3 = values[Math.floor(values.length * 3 / 4)];
             const iqr = q3 - q1;
             const lowerBound = q1 - 1.5 * iqr;
             const upperBound = q3 + 1.5 * iqr;

             if(config.outlierStrategy === 'remove') {
                 data = data.filter(row => {
                     const val = parseFloat(row[colIndex]);
                     return val >= lowerBound && val <= upperBound;
                 });
             } else if (config.outlierStrategy === 'cap') {
                 data.forEach(row => {
                     const val = parseFloat(row[colIndex]);
                     if(val < lowerBound) row[colIndex] = lowerBound.toFixed(2);
                     if(val > upperBound) row[colIndex] = upperBound.toFixed(2);
                 });
             }
        });
        logDetails.push(`Handled outliers using ${config.outlierStrategy} strategy.`);
    }

    // --- 4. CATEGORICAL ENCODING ---
    if (config.encodingStrategy !== 'none') {
        const categoricalColumns = header.map((_, colIndex) => 
            originalData.columns[colIndex].dataType === 'string' ? colIndex : -1
        ).filter(idx => idx !== -1);

        if (categoricalColumns.length > 0) {
            if (config.encodingStrategy === 'label') {
                // Label Encoding: Assign numeric labels to categories
                categoricalColumns.forEach(colIndex => {
                    const uniqueValues = [...new Set(data.map(row => row[colIndex]))].filter(v => v !== '');
                    const labelMap: { [key: string]: number } = {};
                    
                    uniqueValues.forEach((value, index) => {
                        labelMap[value] = index;
                    });

                    data.forEach(row => {
                        if (row[colIndex] !== '' && labelMap[row[colIndex]] !== undefined) {
                            row[colIndex] = labelMap[row[colIndex]].toString();
                        }
                    });
                });
                logDetails.push('Applied Label Encoding to categorical columns.');

            } else if (config.encodingStrategy === 'one-hot') {
                // One-Hot Encoding: Create binary columns for each category
                const newHeader = [...header];
                const newData = data.map(row => [...row]);

                categoricalColumns.forEach(colIndex => {
                    const uniqueValues = [...new Set(data.map(row => row[colIndex]))].filter(v => v !== '');
                    const originalColumnName = header[colIndex];
                    
                    // Add new columns for each unique value
                    uniqueValues.forEach(value => {
                        newHeader.push(`${originalColumnName}_${value}`);
                    });

                    // Update each row with one-hot encoded values
                    newData.forEach(row => {
                        const currentValue = row[colIndex];
                        uniqueValues.forEach(value => {
                            row.push(currentValue === value ? '1' : '0');
                        });
                    });
                });

                // Remove original categorical columns (from right to left to maintain indices)
                categoricalColumns.sort((a, b) => b - a).forEach(colIndex => {
                    newHeader.splice(colIndex, 1);
                    newData.forEach(row => row.splice(colIndex, 1));
                });

                // Update header and data
                header.splice(0, header.length, ...newHeader);
                data = newData;
                logDetails.push('Applied One-Hot Encoding to categorical columns.');
            }
        }
    }

    // --- 5. SCALE DATA ---
    if (config.scaleData) {
        header.forEach((_, colIndex) => {
            if (originalData.columns[colIndex].dataType !== 'number') return;
            const values = data.map(r => parseFloat(r[colIndex])).filter(v => !isNaN(v));
            if(values.length === 0) return;

            const min = Math.min(...values);
            const max = Math.max(...values);
            
            if (max === min) return; // Avoid division by zero

            data.forEach(row => {
                const val = parseFloat(row[colIndex]);
                if (!isNaN(val)) {
                    row[colIndex] = ((val - min) / (max - min)).toFixed(4);
                }
            });
        });
        logDetails.push('Scaled numeric data (Normalization).');
    }
    
    const finalCsvData = [header.join(','), ...data.map(row => row.join(','))].join('\n');
    const finalAnalysis = analyzeCsv(finalCsvData, originalData.stats.fileName);
    setProcessedData(finalAnalysis);
    
    sessionStorage.setItem('preprocessedData', JSON.stringify(finalAnalysis));
     if (primaryKey) {
        sessionStorage.setItem('primaryKey', primaryKey);
    } else {
        sessionStorage.removeItem('primaryKey');
    }

    setIsProcessed(true);

    if (user) {
        addLog({
            user: user.name,
            action: 'Data Preparation',
            details: logDetails.length > 0 ? logDetails.join(' ') : "No processing steps selected."
        })
    }
    toast({
        variant: 'info',
        title: "Preprocessing Complete",
        description: `Data processed successfully. You can now proceed.`
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
                 <h1 className="text-3xl font-bold tracking-tight">Data Preparation</h1>
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
                <PrimaryKeySelection columns={displayData.columns.map(c => c.name)} onSelect={setPrimaryKey} />
                <Configuration onStart={handleProcess} isLoading={loading} />

                {isProcessed && processedData && (
                    <>
                    <DataPreview csvData={processedData.csvData} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Ready for Next Step</CardTitle>
                            <CardDescription>
                                Your data has been successfully prepared. You can now move on to splitting your data for training and testing.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button onClick={() => router.push('/train-test-split')}>
                                Proceed to Train/Test Split
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
