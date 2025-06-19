
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedStudent {
  id: string;
  behavior_score?: number;
  totalMeritPoints: number;
}

interface StudentAnalyticsSummaryProps {
  students: EnhancedStudent[];
}

const StudentAnalyticsSummary: React.FC<StudentAnalyticsSummaryProps> = ({ students }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-mcc-blue">{students.length}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {students.filter(s => (s.behavior_score || 0) >= 7).length}
          </div>
          <div className="text-sm text-gray-600">At Risk</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {students.reduce((sum, s) => sum + s.totalMeritPoints, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Merit Points</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {(students.reduce((sum, s) => sum + (s.behavior_score || 0), 0) / students.length || 0).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Average Heat Score</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAnalyticsSummary;
