
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudents } from '@/hooks/useStudents';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { useToast } from '@/hooks/use-toast';
import StudentAnalyticsFilters from './StudentAnalyticsFilters';
import StudentAnalyticsTable from './StudentAnalyticsTable';
import StudentAnalyticsSummary from './StudentAnalyticsSummary';
import ExportButton from './ExportButton';
import { FileText, TrendingUp } from 'lucide-react';

interface StudentAnalyticsProps {
  className?: string;
}

const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({ className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [sortBy, setSortBy] = useState('heat-score');
  
  const { data: students } = useStudents();
  const { data: records } = useBehaviorRecords();
  const { toast } = useToast();

  // Enhanced student data with analytics
  const enhancedStudents = React.useMemo(() => {
    if (!students || !records) return [];

    return students.map(student => {
      const studentRecords = records.filter(r => r.student_id === student.id);
      const incidents = studentRecords.filter(r => r.type === 'incident');
      const merits = studentRecords.filter(r => r.type === 'merit');
      const totalMeritPoints = merits.reduce((sum, m) => sum + (m.points || 0), 0);
      
      // Calculate trend (last 30 days vs previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
      
      const recentIncidents = incidents.filter(i => 
        new Date(i.timestamp || '') > thirtyDaysAgo
      ).length;
      
      const previousIncidents = incidents.filter(i => {
        const date = new Date(i.timestamp || '');
        return date > sixtyDaysAgo && date <= thirtyDaysAgo;
      }).length;
      
      // Properly type the trend calculation
      const trend: 'up' | 'down' | 'stable' = recentIncidents > previousIncidents ? 'up' : 
                                               recentIncidents < previousIncidents ? 'down' : 'stable';

      return {
        ...student,
        incidentCount: incidents.length,
        meritCount: merits.length,
        totalMeritPoints,
        recentIncidents,
        trend,
        lastIncident: incidents[0]?.timestamp ? new Date(incidents[0].timestamp) : null,
        lastMerit: merits[0]?.timestamp ? new Date(merits[0].timestamp) : null,
      };
    });
  }, [students, records]);

  // Filter and sort students
  const filteredStudents = enhancedStudents
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesForm = selectedGrade === 'all' || student.grade === selectedGrade;
      return matchesSearch && matchesForm;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'heat-score':
          return (b.behavior_score || 0) - (a.behavior_score || 0);
        case 'incidents':
          return b.incidentCount - a.incidentCount;
        case 'merits':
          return b.totalMeritPoints - a.totalMeritPoints;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const generateStudentReport = async (studentId: string) => {
    const student = enhancedStudents.find(s => s.id === studentId);
    if (!student) return;

    try {
      // Generate comprehensive student report
      const reportData = {
        student: student.name,
        form: student.grade,
        heatScore: student.behavior_score || 0,
        totalIncidents: student.incidentCount,
        totalMerits: student.totalMeritPoints,
        recentTrend: student.trend,
        lastActivity: student.lastIncident || student.lastMerit
      };

      toast({
        title: "Report Generated",
        description: `Comprehensive report for ${student.name} has been generated`,
      });

      // In a real implementation, this would generate and download a PDF
      console.log('Generated report for:', reportData);
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "There was an error generating the student report",
        variant: "destructive"
      });
    }
  };

  const exportAllData = () => {
    const exportData = filteredStudents.map(student => ({
      Name: student.name,
      'Student ID': student.student_id,
      Form: student.grade,
      'Heat Score': student.behavior_score || 0,
      'Total Incidents': student.incidentCount,
      'Merit Points': student.totalMeritPoints,
      'Recent Trend': student.trend,
      'Risk Level': student.behavior_score && student.behavior_score >= 7 ? 'High' : 
                   student.behavior_score && student.behavior_score >= 4 ? 'Medium' : 'Low'
    }));

    return exportData;
  };

  const generateComprehensiveReport = async () => {
    try {
      const reportData = {
        totalStudents: filteredStudents.length,
        averageHeatScore: filteredStudents.reduce((sum, s) => sum + (s.behavior_score || 0), 0) / filteredStudents.length,
        highRiskStudents: filteredStudents.filter(s => (s.behavior_score || 0) >= 7).length,
        studentsWithRecentIncidents: filteredStudents.filter(s => s.recentIncidents > 0).length,
        topPerformers: filteredStudents.filter(s => s.totalMeritPoints > 50).length
      };

      toast({
        title: "Comprehensive Report Generated",
        description: "Student analytics summary report has been generated",
      });

      console.log('Comprehensive report data:', reportData);
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "There was an error generating the comprehensive report",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Export Options */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Student Analytics</h2>
          <p className="text-gray-600">Comprehensive behavioral analysis for all students</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateComprehensiveReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Summary
          </Button>
          
          <ExportButton
            data={exportAllData()}
            reportName="Student Analytics"
            onExport={(format) => console.log(`Exporting student analytics as ${format}`)}
          />
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Student Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StudentAnalyticsFilters
            searchTerm={searchTerm}
            selectedGrade={selectedGrade}
            sortBy={sortBy}
            onSearchChange={setSearchTerm}
            onGradeChange={setSelectedGrade}
            onSortChange={setSortBy}
          />
        </CardContent>
      </Card>

      {/* Student Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Student Performance Analysis ({filteredStudents.length} students)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <StudentAnalyticsTable
            students={filteredStudents}
            onGenerateReport={generateStudentReport}
          />
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <StudentAnalyticsSummary students={filteredStudents} />
    </div>
  );
};

export default StudentAnalytics;
