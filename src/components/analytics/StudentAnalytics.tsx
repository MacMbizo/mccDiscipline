
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudents } from '@/hooks/useStudents';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import StudentAnalyticsFilters from './StudentAnalyticsFilters';
import StudentAnalyticsTable from './StudentAnalyticsTable';
import StudentAnalyticsSummary from './StudentAnalyticsSummary';

interface StudentAnalyticsProps {
  className?: string;
}

const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({ className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [sortBy, setSortBy] = useState('heat-score');
  
  const { data: students } = useStudents();
  const { data: records } = useBehaviorRecords();

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
      
      const trend = recentIncidents > previousIncidents ? 'up' : 
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

  const generateStudentReport = (studentId: string) => {
    console.log(`Generating report for student: ${studentId}`);
    // Implementation for individual student report
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Student Analytics</CardTitle>
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
