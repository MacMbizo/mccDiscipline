
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import StudentCard from './StudentCard';

interface StudentListProps {
  onStudentSelect?: (studentId: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ onStudentSelect }) => {
  const { data: students, isLoading } = useStudents();
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');

  const filteredStudents = students?.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const grades = [...new Set(students?.map(s => s.grade) || [])];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-mcc-blue">Loading students...</div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Students ({filteredStudents?.length || 0})
        </CardTitle>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map(grade => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents?.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => onStudentSelect?.(student.id)}
            />
          ))}
        </div>
        {filteredStudents?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;
