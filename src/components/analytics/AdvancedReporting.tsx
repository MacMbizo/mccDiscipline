
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { useStudents } from '@/hooks/useStudents';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  BarChart3,
  PieChart,
  Share,
  Clock,
  Users
} from 'lucide-react';
import AdvancedCharts from './AdvancedCharts';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'student' | 'class' | 'incident' | 'merit' | 'comparative';
  icon: React.ReactNode;
  estimatedTime: string;
}

interface AdvancedReportingProps {
  className?: string;
}

const AdvancedReporting: React.FC<AdvancedReportingProps> = ({ className = "" }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState('current-term');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  
  const { data: records = [] } = useBehaviorRecords();
  const { data: students = [] } = useStudents();

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'comprehensive-student',
      name: 'Comprehensive Student Analysis',
      description: 'Detailed behavioral analysis for individual students with trends and interventions',
      type: 'student',
      icon: <Users className="h-4 w-4" />,
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'class-performance',
      name: 'Class Performance Dashboard',
      description: 'Grade-level behavioral metrics with comparative analysis',
      type: 'class',
      icon: <BarChart3 className="h-4 w-4" />,
      estimatedTime: '1-2 minutes'
    },
    {
      id: 'incident-analysis',
      name: 'Incident Pattern Analysis',
      description: 'Deep dive into incident types, locations, and trends',
      type: 'incident',
      icon: <TrendingUp className="h-4 w-4" />,
      estimatedTime: '3-4 minutes'
    },
    {
      id: 'merit-effectiveness',
      name: 'Merit System Effectiveness',
      description: 'Analysis of merit distribution and impact on behavior',
      type: 'merit',
      icon: <PieChart className="h-4 w-4" />,
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'comparative-trends',
      name: 'Comparative Trend Analysis',
      description: 'Cross-grade comparisons and longitudinal trend analysis',
      type: 'comparative',
      icon: <TrendingUp className="h-4 w-4" />,
      estimatedTime: '4-5 minutes'
    },
    {
      id: 'executive-summary',
      name: 'Executive Summary',
      description: 'High-level overview for administrators and leadership',
      type: 'comparative',
      icon: <FileText className="h-4 w-4" />,
      estimatedTime: '1 minute'
    }
  ];

  const generateReport = async () => {
    console.log('Generating report with params:', {
      template: selectedTemplate,
      dateRange,
      format: reportFormat,
      includeCharts,
      grades: selectedGrades
    });
    // Implementation for report generation
  };

  const scheduleReport = () => {
    console.log('Scheduling report...');
    // Implementation for report scheduling
  };

  const availableGrades = [...new Set(students.map(s => s.grade))].sort();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Advanced Reporting</h2>
          <p className="text-gray-600">Generate comprehensive behavioral analytics reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={scheduleReport}>
            <Clock className="h-4 w-4 mr-2" />
            Schedule Reports
          </Button>
          <Button onClick={generateReport} disabled={!selectedTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Report Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{template.type}</Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {template.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Configuration Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-term">Current Term</SelectItem>
                      <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="academic-year">Academic Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                      <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="grades">Include Grades</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableGrades.map((grade) => (
                      <label key={grade} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedGrades.includes(grade)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGrades([...selectedGrades, grade]);
                            } else {
                              setSelectedGrades(selectedGrades.filter(g => g !== grade));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">Grade {grade}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include-charts"
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="include-charts">Include Charts & Visualizations</Label>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Estimated generation time:</span>
                    <span className="font-medium">
                      {selectedTemplate ? reportTemplates.find(t => t.id === selectedTemplate)?.estimatedTime : '---'}
                    </span>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={generateReport}
                    disabled={!selectedTemplate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <p className="text-sm text-gray-600">
                Drag and drop components to build your custom report
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Available Components</h3>
                  <div className="space-y-2">
                    {[
                      'Student List Table',
                      'Behavior Score Chart',
                      'Incident Trends',
                      'Merit Distribution',
                      'Heat Score Analysis',
                      'Comparative Metrics'
                    ].map((component) => (
                      <div
                        key={component}
                        className="p-3 border rounded-lg cursor-move hover:bg-gray-50"
                        draggable
                      >
                        <span className="text-sm">{component}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <h3 className="font-medium mb-3">Report Layout</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[400px] bg-gray-50">
                    <p className="text-center text-gray-500">
                      Drag components here to build your custom report
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Weekly Behavior Summary',
                    frequency: 'Every Monday',
                    recipients: 'All Teachers',
                    nextRun: '2023-09-18'
                  },
                  {
                    name: 'Monthly Administrative Report',
                    frequency: 'First of each month',
                    recipients: 'Admin Team',
                    nextRun: '2023-10-01'
                  }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-gray-600">
                        {report.frequency} • {report.recipients} • Next: {report.nextRun}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Live Preview Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedCharts />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedReporting;
