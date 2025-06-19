
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus, FileText } from 'lucide-react';
import HeatBar from '@/components/common/HeatBar';

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
  trend: string;
  lastIncident: Date | null;
  lastMerit: Date | null;
}

interface StudentAnalyticsTableProps {
  students: EnhancedStudent[];
  onGenerateReport: (studentId: string) => void;
}

const StudentAnalyticsTable: React.FC<StudentAnalyticsTableProps> = ({
  students,
  onGenerateReport,
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

  const getRiskLevel = (score: number) => {
    if (score >= 8) return { level: 'High', color: 'bg-red-100 text-red-800' };
    if (score >= 6) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    if (score >= 4) return { level: 'Low', color: 'bg-blue-100 text-blue-800' };
    return { level: 'Minimal', color: 'bg-green-100 text-green-800' };
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Heat Score</TableHead>
          <TableHead>Risk Level</TableHead>
          <TableHead>Incidents</TableHead>
          <TableHead>Merit Points</TableHead>
          <TableHead>Trend</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => {
          const riskLevel = getRiskLevel(student.behavior_score || 0);
          return (
            <TableRow key={student.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.student_id}</div>
                </div>
              </TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{(student.behavior_score || 0).toFixed(1)}</span>
                  <div className="w-20">
                    <HeatBar score={student.behavior_score || 0} size="sm" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={riskLevel.color}>
                  {riskLevel.level}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-center">
                  <div className="font-medium">{student.incidentCount}</div>
                  <div className="text-xs text-gray-500">
                    {student.recentIncidents} recent
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-center">
                  <div className="font-medium text-green-600">{student.totalMeritPoints}</div>
                  <div className="text-xs text-gray-500">
                    {student.meritCount} awards
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  {getTrendIcon(student.trend)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {student.lastIncident && (
                    <div className="text-red-600">
                      Incident: {student.lastIncident.toLocaleDateString()}
                    </div>
                  )}
                  {student.lastMerit && (
                    <div className="text-green-600">
                      Merit: {student.lastMerit.toLocaleDateString()}
                    </div>
                  )}
                  {!student.lastIncident && !student.lastMerit && (
                    <div className="text-gray-500">No recent activity</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateReport(student.id)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default StudentAnalyticsTable;
