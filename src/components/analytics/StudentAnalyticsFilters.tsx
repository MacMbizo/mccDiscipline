
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface StudentAnalyticsFiltersProps {
  searchTerm: string;
  selectedGrade: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const StudentAnalyticsFilters: React.FC<StudentAnalyticsFiltersProps> = ({
  searchTerm,
  selectedGrade,
  sortBy,
  onSearchChange,
  onGradeChange,
  onSortChange,
}) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="relative flex-1 min-w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedGrade} onValueChange={onGradeChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="All Forms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Forms</SelectItem>
          <SelectItem value="Form 1">Form 1</SelectItem>
          <SelectItem value="Form 2">Form 2</SelectItem>
          <SelectItem value="Form 3">Form 3</SelectItem>
          <SelectItem value="Form 4">Form 4</SelectItem>
          <SelectItem value="Form 5">Form 5</SelectItem>
          <SelectItem value="Form 6">Form 6</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="heat-score">Heat Score</SelectItem>
          <SelectItem value="incidents">Incident Count</SelectItem>
          <SelectItem value="merits">Merit Points</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudentAnalyticsFilters;
