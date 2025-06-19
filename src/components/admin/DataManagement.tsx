import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Upload, 
  FileText, 
  Database, 
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DataManagement: React.FC = () => {
  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportData = async (dataType: string) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      let data;
      let filename;

      switch (dataType) {
        case 'students':
          const { data: students } = await supabase.from('students').select('*');
          data = students;
          filename = 'students_export.csv';
          break;
        case 'behavior_records':
          const { data: records } = await supabase
            .from('behavior_records')
            .select(`
              *,
              student:students(name, grade),
              misdemeanor:misdemeanors(name, location),
              reporter:profiles(name)
            `);
          data = records;
          filename = 'behavior_records_export.csv';
          break;
        case 'misdemeanors':
          const { data: misdemeanors } = await supabase.from('misdemeanors').select('*');
          data = misdemeanors;
          filename = 'misdemeanors_export.csv';
          break;
        default:
          throw new Error('Unknown data type');
      }

      // Simulate progress
      for (let i = 10; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Convert to CSV
      const csv = convertToCSV(data);
      downloadCSV(csv, filename);

      toast({
        title: "Export Successful",
        description: `${dataType} data has been exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred during export. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleImportData = async (file: File, dataType: string) => {
    setIsImporting(true);
    setImportProgress(0);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      // Simulate progress
      for (let i = 10; i <= 90; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Process import based on data type
      switch (dataType) {
        case 'students':
          await importStudents(rows);
          break;
        case 'behavior_records':
          await importBehaviorRecords(rows);
          break;
        case 'misdemeanors':
          await importMisdemeanors(rows);
          break;
      }

      setImportProgress(100);

      toast({
        title: "Import Successful",
        description: `${rows.length} records imported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "An error occurred during import. Please check your file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    }).filter(row => Object.values(row).some(v => v)); // Remove empty rows
  };

  const importStudents = async (rows: any[]) => {
    const { error } = await supabase.from('students').insert(
      rows.map(row => ({
        student_id: row.student_id,
        name: row.name,
        grade: row.grade,
        behavior_score: parseFloat(row.behavior_score) || 0,
      }))
    );
    if (error) throw error;
  };

  const importBehaviorRecords = async (rows: any[]) => {
    const { error } = await supabase.from('behavior_records').insert(
      rows.map(row => ({
        student_id: row.student_id,
        type: row.type,
        description: row.description,
        location: row.location,
        misdemeanor_id: row.misdemeanor_id,
        merit_tier: row.merit_tier,
        points: row.points ? parseFloat(row.points) : null,
        offense_number: row.offense_number ? parseInt(row.offense_number) : null,
        sanction: row.sanction,
        reported_by: row.reported_by,
      }))
    );
    if (error) throw error;
  };

  const importMisdemeanors = async (rows: any[]) => {
    const { error } = await supabase.from('misdemeanors').insert(
      rows.map(row => ({
        name: row.name,
        location: row.location,
        sanctions: row.sanctions ? JSON.parse(row.sanctions) : {},
        category: row.category,
        severity_level: row.severity_level ? parseInt(row.severity_level) : 1,
      }))
    );
    if (error) throw error;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Students Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Export all student records including grades and behavior scores.
                  </p>
                  <Button 
                    onClick={() => handleExportData('students')}
                    disabled={isExporting}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Students
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Behavior Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Export all incident and merit records with details.
                  </p>
                  <Button 
                    onClick={() => handleExportData('behavior_records')}
                    disabled={isExporting}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Records
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Misdemeanors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Export misdemeanor types and sanction configurations.
                  </p>
                  <Button 
                    onClick={() => handleExportData('misdemeanors')}
                    disabled={isExporting}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Misdemeanors
                  </Button>
                </CardContent>
              </Card>
            </div>

            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Exporting data...</span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Import Guidelines</h4>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• Ensure CSV files have proper headers matching database fields</li>
                      <li>• Large imports may take several minutes to complete</li>
                      <li>• Duplicate records will be skipped automatically</li>
                      <li>• Always backup your data before importing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Import Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Label htmlFor="students-file">Select CSV File</Label>
                      <Input
                        id="students-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImportData(file, 'students');
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Import Behavior Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Label htmlFor="records-file">Select CSV File</Label>
                      <Input
                        id="records-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImportData(file, 'behavior_records');
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Import Misdemeanors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Label htmlFor="misdemeanors-file">Select CSV File</Label>
                      <Input
                        id="misdemeanors-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImportData(file, 'misdemeanors');
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Importing data...</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Automated Backups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Daily Automatic Backup</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Backup</span>
                      <span className="text-sm text-gray-600">Today at 3:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Retention Period</span>
                      <span className="text-sm text-gray-600">30 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manual Backup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Create a complete backup of all system data including students, behavior records, and configurations.
                  </p>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Create Full Backup
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Recovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Restore system data from a previous backup. This operation cannot be undone.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataManagement;
