
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  FileText,
  Users,
  AlertTriangle,
  Award,
  Brain,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import AnalyticsOverview from './AnalyticsOverview';
import BehaviorChart from './BehaviorChart';
import ReportFilters from './ReportFilters';
import ReportsList from './ReportsList';
import InsightsPanel from './InsightsPanel';
import BehaviorInsights from './BehaviorInsights';
import PredictiveAnalytics from './PredictiveAnalytics';
import AdvancedReporting from './AdvancedReporting';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { useStudents } from '@/hooks/useStudents';

interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  lastGenerated?: string;
}

const ReportsAndAnalytics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('current-term');
  
  const { data: records } = useBehaviorRecords();
  const { data: students } = useStudents();

  const availableReports: ReportItem[] = [
    {
      id: 'student-behavior-summary',
      title: 'Student Behavior Summary',
      description: 'Comprehensive overview of individual student behavior patterns',
      category: 'student',
      icon: <Users className="h-4 w-4" />,
      lastGenerated: '2023-09-15'
    },
    {
      id: 'merit-points-analysis',
      title: 'Merit Points Analysis',
      description: 'Analysis of merit points awarded by category and teacher',
      category: 'merit',
      icon: <Award className="h-4 w-4" />,
      lastGenerated: '2023-09-10'
    },
    {
      id: 'incident-trends',
      title: 'Incident Trends Report',
      description: 'Monthly and weekly trends in disciplinary incidents',
      category: 'incident',
      icon: <AlertTriangle className="h-4 w-4" />,
      lastGenerated: '2023-09-12'
    },
    {
      id: 'class-performance',
      title: 'Class Performance Report',
      description: 'Grade-level behavior analysis and comparisons',
      category: 'analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      lastGenerated: '2023-09-08'
    },
    {
      id: 'teacher-activity',
      title: 'Teacher Activity Report',
      description: 'Overview of teacher reporting patterns and statistics',
      category: 'staff',
      icon: <FileText className="h-4 w-4" />,
      lastGenerated: '2023-09-14'
    },
    {
      id: 'heat-score-distribution',
      title: 'Heat Score Distribution',
      description: 'Analysis of student heat score patterns across grades',
      category: 'analytics',
      icon: <TrendingUp className="h-4 w-4" />,
      lastGenerated: '2023-09-11'
    }
  ];

  const filteredReports = availableReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
  };

  const handleDownloadReport = (reportId: string, format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Downloading report ${reportId} as ${format}`);
  };

  // Calculate analytics data
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
      <div className="bg-mcc-blue text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-blue-100">Advanced behavioral analytics and predictive insights</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Analytics Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Analytics Overview</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <AnalyticsOverview data={analyticsData} showAdvanced={true} />
            </CardContent>
          </Card>

          {/* Quick Charts */}
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

        <TabsContent value="insights" className="space-y-6">
          <BehaviorInsights />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AdvancedReporting />
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
              title="Heat Score Distribution"
            />
            <BehaviorChart 
              type="line" 
              title="Weekly Activity"
            />
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          {/* Student Engagement will be imported separately */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Student Engagement Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track student motivation, achievements, and engagement metrics to drive positive behavior.
              </p>
              <Button className="mt-4">
                <Target className="h-4 w-4 mr-2" />
                View Engagement Dashboard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <InsightsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAndAnalytics;
