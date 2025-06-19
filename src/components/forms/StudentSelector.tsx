
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from 'lucide-react';
import { Student } from '@/hooks/useStudents';

interface StudentSelectorProps {
  students: Student[];
  selectedStudent: string;
  onStudentChange: (studentId: string) => void;
  error?: string;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedStudent,
  onStudentChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="student">Student</Label>
      <Select value={selectedStudent} onValueChange={onStudentChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a student" />
        </SelectTrigger>
        <SelectContent>
          {students.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {student.name} - {student.grade}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default StudentSelector;
