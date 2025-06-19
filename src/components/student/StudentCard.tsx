
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap } from 'lucide-react';
import HeatBar from '@/components/common/HeatBar';
import type { Student } from '@/hooks/useStudents';

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
  className?: string;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onClick,
  className = ""
}) => {
  return (
    <Card 
      className={`hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-mcc-blue-dark">
            <User className="h-4 w-4" />
            {student.name}
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            {student.grade}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">ID: {student.student_id}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <HeatBar 
            score={student.behavior_score || 0} 
            size="sm" 
            showTrend={false}
          />
          <div className="text-xs text-gray-500">
            Last updated: {new Date(student.updated_at || '').toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
