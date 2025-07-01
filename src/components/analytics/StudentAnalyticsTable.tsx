
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import HeatBar from '@/components/common/HeatBar';
import { FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EnhancedStudent {
  id: string;
  name: string;
  student_id: string;
  grade: string;
  behavior_score?: number;
  incidentCount: number;
  meritCount: number;
  totalMeritPoints: number;
  recentIncidents: number;
  trend: 'up' | 'down' | 'stable';
  lastIncident: Date | null;
  lastMerit: Date | null;
}

interface StudentAnalyticsTableProps {
  students: EnhancedStudent[];
  onGenerateReport: (studentId: string) => void;
}

const StudentAnalyticsTable: React.FC<StudentAnalyticsTableProps> = ({ 
  students, 
  onGenerateReport 
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600';
      case 'down': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString();
  };

  const getRiskLevel = (score: number) => {
    if (score >= 8) return { level: 'High', color: 'destructive' };
    if (score >= 6) return { level: 'Medium', color: 'secondary' };
    if (score >= 4) return { level: 'Low', color: 'outline' };
    return { level: 'Minimal', color: 'default' };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Student</TableHead>
            <TableHead className="w-24">Form</TableHead>
            <TableHead className="w-32">Heat Score</TableHead>
            <TableHead className="w-24">Risk Level</TableHead>
            <TableHead className="w-24">Incidents</TableHead>
            <TableHead className="w-24">Merit Points</TableHead>
            <TableHead className="w-24">Trend</TableHead>
            <TableHead className="w-32">Last Activity</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                No students found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => {
              const riskLevel = getRiskLevel(student.behavior_score || 0);
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.student_id}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-medium">
                    {student.grade}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2">
                      <div className="font-semibold text-lg">
                        {(student.behavior_score || 0).toFixed(1)}
                      </div>
                      <HeatBar 
                        score={student.behavior_score || 0} 
                        maxScore={10}
                        className="w-16"
                      />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={riskLevel.color as any}>
                      {riskLevel.level}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.incidentCount}</div>
                      <div className="text-xs text-gray-500">
                        {student.recentIncidents} recent
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium text-blue-600">
                        {student.totalMeritPoints}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.meritCount} awards
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className={`flex items-center gap-1 ${getTrendColor(student.trend)}`}>
                      {getTrendIcon(student.trend)}
                      <span className="text-sm capitalize">{student.trend}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div>I: {formatDate(student.lastIncident)}</div>
                      <div>M: {formatDate(student.lastMerit)}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onGenerateReport(student.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentAnalyticsTable;
