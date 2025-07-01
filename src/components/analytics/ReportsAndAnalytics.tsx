import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart3,
  TrendingUp,
  FileText,
  Users,
  AlertTriangle,
  Award,
  Download,
  Share,
  Filter,
  Search,
  Calendar,
  Clock,
  Mail,
  PlayCircle,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import AnalyticsOverview from './AnalyticsOverview';
import BehaviorChart from './BehaviorChart';
import ReportExporter from './ReportExporter';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { useStudents } from '@/hooks/useStudents';

interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  lastGenerated?: string;
  format?: string[];
  data?: any;
  canGenerate: boolean;
  canExport: boolean;
  canShare: boolean;
}

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  nextRun: string;
  isActive: boolean;
  createdAt: Date;
  lastRun?: Date;
}

interface CustomReportBuilder {
  name: string;
  description: string;
  components: string[];
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    forms: string[];
    locations: string[];
    categories: string[];
  };
  format: 'pdf' | 'excel' | 'csv';
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

const ReportsAndAnalytics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('current-term');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [customBuilderDialog, setCustomBuilderDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [customBuilder, setCustomBuilder] = useState<CustomReportBuilder>({
    name: '',
    description: '',
    components: [],
    dateRange: { start: '', end: '' },
    filters: { forms: [], locations: [], categories: [] },
    format: 'pdf',
    schedule: { enabled: false, frequency: 'weekly', recipients: [] }
  });
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Weekly Behavior Summary',
      reportType: 'student-behavior-summary',
      frequency: 'weekly',
      recipients: ['teachers@mcc.edu', 'admin@mcc.edu'],
      nextRun: '2023-09-18',
      isActive: true,
      createdAt: new Date('2023-09-01'),
      lastRun: new Date('2023-09-11')
    },
    {
      id: '2',
      name: 'Monthly Administrative Report',
      reportType: 'comprehensive-analysis',
      frequency: 'monthly',
      recipients: ['principal@mcc.edu', 'board@mcc.edu'],
      nextRun: '2023-10-01',
      isActive: true,
      createdAt: new Date('2023-08-15')
    }
  ]);
  
  const { data: records } = useBehaviorRecords();
  const { data: students } = useStudents();
  const { toast } = useToast();

  // Generate report data
  const generateReportData = (reportId: string) => {
    switch (reportId) {
      case 'student-behavior-summary':
        return students?.map(student => ({
          name: student.name,
          form: student.grade,
          heatScore: student.behavior_score || 0,
          incidents: records?.filter(r => r.student_id === student.id && r.type === 'incident').length || 0,
          merits: records?.filter(r => r.student_id === student.id && r.type === 'merit').length || 0
        })) || [];
      
      case 'merit-points-analysis':
        const meritData = records?.filter(r => r.type === 'merit') || [];
        return meritData.map(merit => ({
          student: students?.find(s => s.id === merit.student_id)?.name || 'Unknown',
          form: students?.find(s => s.id === merit.student_id)?.grade || 'Unknown',
          tier: merit.merit_tier,
          points: merit.points,
          date: merit.created_at
        }));
      
      default:
        return [];
    }
  };

  const availableReports: ReportItem[] = [
    {
      id: 'student-behavior-summary',
      title: 'Student Behavior Summary',
      description: 'Comprehensive overview of individual student behavior patterns',
      category: 'student',
      icon: <Users className="h-4 w-4" />,
      lastGenerated: '2023-09-15',
      format: ['PDF', 'Excel', 'CSV'],
      data: generateReportData('student-behavior-summary'),
      canGenerate: true,
      canExport: true,
      canShare: true
    },
    {
      id: 'merit-points-analysis',
      title: 'Merit Points Analysis',
      description: 'Analysis of merit points awarded by category and teacher',
      category: 'merit',
      icon: <Award className="h-4 w-4" />,
      lastGenerated: '2023-09-10',
      format: ['PDF', 'CSV'],
      data: generateReportData('merit-points-analysis'),
      canGenerate: true,
      canExport: true,
      canShare: true
    },
    {
      id: 'incident-trends',
      title: 'Incident Trends Report',
      description: 'Monthly and weekly trends in disciplinary incidents',
      category: 'incident',
      icon: <AlertTriangle className="h-4 w-4" />,
      lastGenerated: '2023-09-12',
      format: ['PDF', 'Excel', 'CSV'],
      canGenerate: true,
      canExport: true,
      canShare: true
    },
    {
      id: 'form-performance',
      title: 'Form Performance Report',
      description: 'Form-level behavior analysis and comparisons',
      category: 'analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      lastGenerated: '2023-09-08',
      format: ['PDF', 'Excel'],
      canGenerate: true,
      canExport: true,
      canShare: true
    },
    {
      id: 'teacher-activity',
      title: 'Teacher Activity Report',
      description: 'Overview of teacher reporting patterns and statistics',
      category: 'staff',
      icon: <FileText className="h-4 w-4" />,
      lastGenerated: '2023-09-14',
      format: ['PDF', 'CSV'],
      canGenerate: true,
      canExport: true,
      canShare: false
    },
    {
      id: 'heat-score-distribution',
      title: 'Heat Score Distribution',
      description: 'Analysis of student heat score patterns across forms',
      category: 'analytics',
      icon: <TrendingUp className="h-4 w-4" />,
      lastGenerated: '2023-09-11',
      format: ['PDF', 'Excel'],
      canGenerate: true,
      canExport: true,
      canShare: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'student', label: 'Student Reports' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'incident', label: 'Incidents' },
    { value: 'merit', label: 'Merits' },
    { value: 'staff', label: 'Staff Reports' }
  ];

  const availableComponents = [
    'Student List Table',
    'Behavior Score Chart',
    'Incident Trends Graph',
    'Merit Distribution Pie Chart',
    'Heat Score Analysis',
    'Form Comparison Chart',
    'Teacher Activity Summary',
    'Monthly Statistics'
  ];

  const filteredReports = availableReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateReport = async (reportId: string, format: string = 'PDF') => {
    setIsGenerating(reportId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const report = availableReports.find(r => r.id === reportId);
      toast({
        title: "Report Generated",
        description: `${report?.title} has been generated successfully in ${format} format`,
      });

      // Update last generated date
      const reportIndex = availableReports.findIndex(r => r.id === reportId);
      if (reportIndex !== -1) {
        availableReports[reportIndex].lastGenerated = new Date().toISOString().split('T')[0];
      }
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "There was an error generating the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleExportReport = (reportId: string, format: string) => {
    const report = availableReports.find(r => r.id === reportId);
    if (!report) return;

    toast({
      title: "Export Started",
      description: `${report.title} is being exported as ${format.toUpperCase()}`,
    });

    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${report.title}.${format.toLowerCase()} has been downloaded`,
      });
    }, 1500);
  };

  const handleShareReport = (reportId: string) => {
    const report = availableReports.find(r => r.id === reportId);
    if (!report) return;

    const shareUrl = `${window.location.origin}/reports/shared/${reportId}`;
    
    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: report.description,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Share Link Copied",
        description: "Report sharing link has been copied to clipboard",
      });
    }
  };

  const handleCreateCustomReport = () => {
    if (!customBuilder.name || customBuilder.components.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a report name and select at least one component",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Custom Report Created",
      description: `${customBuilder.name} has been created and ${customBuilder.schedule?.enabled ? 'scheduled' : 'saved'}`,
    });

    // Reset builder
    setCustomBuilder({
      name: '',
      description: '',
      components: [],
      dateRange: { start: '', end: '' },
      filters: { forms: [], locations: [], categories: [] },
      format: 'pdf',
      schedule: { enabled: false, frequency: 'weekly', recipients: [] }
    });
    setCustomBuilderDialog(false);
  };

  const handleScheduleReport = () => {
    const newScheduledReport: ScheduledReport = {
      id: Date.now().toString(),
      name: `Scheduled Report - ${new Date().toLocaleDateString()}`,
      reportType: 'custom',
      frequency: 'weekly',
      recipients: ['admin@mcc.edu'],
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      createdAt: new Date()
    };

    setScheduledReports(prev => [newScheduledReport, ...prev]);
    setScheduleDialog(false);

    toast({
      title: "Report Scheduled",
      description: "Your report has been scheduled successfully",
    });
  };

  const toggleScheduledReport = (reportId: string) => {
    setScheduledReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, isActive: !report.isActive } : report
    ));

    const report = scheduledReports.find(r => r.id === reportId);
    toast({
      title: report?.isActive ? "Report Paused" : "Report Activated",
      description: `Scheduled report has been ${report?.isActive ? 'paused' : 'activated'}`,
    });
  };

  const deleteScheduledReport = (reportId: string) => {
    setScheduledReports(prev => prev.filter(report => report.id !== reportId));
    toast({
      title: "Scheduled Report Deleted",
      description: "The scheduled report has been removed",
      variant: "destructive"
    });
  };

  const handleExportSummary = () => {
    const summaryData = {
      totalStudents: students?.length || 0,
      totalIncidents: records?.filter(r => r.type === 'incident').length || 0,
      totalMerits: records?.filter(r => r.type === 'merit').length || 0,
      averageHeatScore: students?.reduce((sum, s) => sum + (s.behavior_score || 0), 0) / (students?.length || 1) || 0
    };

    // Create CSV content
    const csvContent = [
      'Metric,Value',
      `Total Students,${summaryData.totalStudents}`,
      `Total Incidents,${summaryData.totalIncidents}`,
      `Total Merits,${summaryData.totalMerits}`,
      `Average Heat Score,${summaryData.averageHeatScore.toFixed(2)}`
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'report-summary.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Summary Exported",
      description: "Report summary has been downloaded as CSV",
    });
  };

  // Calculate analytics data with Form terminology
  const analyticsData = React.useMemo(() => {
    if (!records || !students) return undefined;

    const incidents = records.filter(r => r.type === 'incident');
    const merits = records.filter(r => r.type === 'merit');
    const totalMeritPoints = merits.reduce((sum, merit) => sum + (merit.points || 0), 0);
    const avgHeatScore = students.reduce((sum, student) => sum + (student.behavior_score || 0), 0) / students.length;
    const studentsAtRisk = students.filter(s => (s.behavior_score || 0) >= 7).length;

    return {
      totalIncidents: incidents.length,
      incidentsChange: 12,
      meritPoints: totalMeritPoints,
      meritPointsChange: 23,
      avgHeatScore: avgHeatScore,
      heatScoreChange: -5,
      studentsAtRisk: studentsAtRisk,
      studentsAtRiskChange: -3,
      predictedInterventions: 8,
      automationEfficiency: 87
    };
  }, [records, students]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-blue-100">Advanced behavioral analytics and comprehensive reporting</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Analytics Overview</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExportSummary}>
                <Download className="h-4 w-4 mr-2" />
                Export Summary
              </Button>
            </CardHeader>
            <CardContent>
              <AnalyticsOverview data={analyticsData} showAdvanced={true} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BehaviorChart 
              type="bar" 
              title="Monthly Incidents vs Merits"
            />
            <BehaviorChart 
              type="line" 
              title="Heat Score Trend"
            />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-term">Current Term</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="academic-year">Academic Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Available Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Available Reports ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {report.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-blue-900">{report.title}</h3>
                            <div className="flex gap-1">
                              {report.format?.map(format => (
                                <span key={format} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {format}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                          {report.lastGenerated && (
                            <p className="text-xs text-gray-500">
                              Last generated: {report.lastGenerated}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {report.canGenerate && (
                          <Button
                            size="sm"
                            onClick={() => handleGenerateReport(report.id)}
                            disabled={isGenerating === report.id}
                          >
                            {isGenerating === report.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4 mr-2" />
                                Generate
                              </>
                            )}
                          </Button>
                        )}
                        
                        <div className="flex gap-1">
                          {report.canExport && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExportReport(report.id, 'pdf')}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          
                          {report.canShare && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareReport(report.id)}
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        {report.data && (
                          <ReportExporter
                            data={report.data}
                            reportName={report.title}
                            onExport={(format) => console.log(`Exporting ${report.title} as ${format}`)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BehaviorChart 
              type="bar" 
              title="Incidents by Category"
            />
            <BehaviorChart 
              type="line" 
              title="Merit Points Trend"
            />
            <BehaviorChart 
              type="bar" 
              title="Heat Score Distribution by Form"
            />
            <BehaviorChart 
              type="line" 
              title="Weekly Activity"
            />
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {/* Custom Builder and Scheduled Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Custom Report Builder */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Custom Report Builder</CardTitle>
                  <Dialog open={customBuilderDialog} onOpenChange={setCustomBuilderDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Build Report
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Build Custom Report</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                          <div>
                            <Label>Report Name *</Label>
                            <Input
                              placeholder="Enter report name"
                              value={customBuilder.name}
                              onChange={(e) => setCustomBuilder(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Describe what this report will show"
                              value={customBuilder.description}
                              onChange={(e) => setCustomBuilder(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>
                        </div>

                        {/* Components Selection */}
                        <div>
                          <Label>Select Components *</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {availableComponents.map((component) => (
                              <label key={component} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={customBuilder.components.includes(component)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setCustomBuilder(prev => ({ 
                                        ...prev, 
                                        components: [...prev.components, component] 
                                      }));
                                    } else {
                                      setCustomBuilder(prev => ({ 
                                        ...prev, 
                                        components: prev.components.filter(c => c !== component) 
                                      }));
                                    }
                                  }}
                                  className="rounded"
                                />
                                <span className="text-sm">{component}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              type="date"
                              value={customBuilder.dateRange.start}
                              onChange={(e) => setCustomBuilder(prev => ({ 
                                ...prev, 
                                dateRange: { ...prev.dateRange, start: e.target.value } 
                              }))}
                            />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input
                              type="date"
                              value={customBuilder.dateRange.end}
                              onChange={(e) => setCustomBuilder(prev => ({ 
                                ...prev, 
                                dateRange: { ...prev.dateRange, end: e.target.value } 
                              }))}
                            />
                          </div>
                        </div>

                        {/* Format Selection */}
                        <div>
                          <Label>Output Format</Label>
                          <Select value={customBuilder.format} onValueChange={(value: any) => setCustomBuilder(prev => ({ ...prev, format: value }))}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF Document</SelectItem>
                              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                              <SelectItem value="csv">CSV Data</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Scheduling Options */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={customBuilder.schedule?.enabled || false}
                              onCheckedChange={(checked) => setCustomBuilder(prev => ({ 
                                ...prev, 
                                schedule: { ...prev.schedule!, enabled: checked } 
                              }))}
                            />
                            <Label>Schedule this report to run automatically</Label>
                          </div>
                          
                          {customBuilder.schedule?.enabled && (
                            <div className="ml-6 space-y-4">
                              <div>
                                <Label>Frequency</Label>
                                <Select 
                                  value={customBuilder.schedule.frequency} 
                                  onValueChange={(value: any) => setCustomBuilder(prev => ({ 
                                    ...prev, 
                                    schedule: { ...prev.schedule!, frequency: value } 
                                  }))}
                                >
                                  <SelectTrigger className="w-48">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label>Email Recipients</Label>
                                <Input
                                  placeholder="Enter email addresses separated by commas"
                                  value={customBuilder.schedule.recipients.join(', ')}
                                  onChange={(e) => setCustomBuilder(prev => ({ 
                                    ...prev, 
                                    schedule: { ...prev.schedule!, recipients: e.target.value.split(',').map(email => email.trim()) } 
                                  }))}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setCustomBuilderDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateCustomReport}>
                            {customBuilder.schedule?.enabled ? 'Create & Schedule' : 'Create Report'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Create custom reports by selecting components and configuring filters
                </p>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Available Components:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      {availableComponents.slice(0, 6).map((component) => (
                        <div key={component} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {component}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Reports */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Scheduled Reports ({scheduledReports.filter(r => r.isActive).length})</CardTitle>
                  <Dialog open={scheduleDialog} onOpenChange={setScheduleDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Report
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Report</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Report Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="behavior-summary">Behavior Summary</SelectItem>
                              <SelectItem value="merit-analysis">Merit Analysis</SelectItem>
                              <SelectItem value="incident-trends">Incident Trends</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Frequency</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Recipients</Label>
                          <Input placeholder="Enter email addresses separated by commas" />
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setScheduleDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleScheduleReport}>
                            Schedule Report
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{report.name}</h4>
                          <Badge variant={report.isActive ? "default" : "secondary"}>
                            {report.isActive ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {report.frequency}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {report.recipients.length} recipients
                            </span>
                          </div>
                          <p className="mt-1">Next run: {report.nextRun}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleScheduledReport(report.id)}
                        >
                          {report.isActive ? <PlayCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteScheduledReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {scheduledReports.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No scheduled reports</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAndAnalytics;
