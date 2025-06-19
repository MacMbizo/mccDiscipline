
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Calendar } from 'lucide-react';

interface ReportFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  dateRange: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  searchTerm,
  selectedCategory,
  dateRange,
  onSearchChange,
  onCategoryChange,
  onDateRangeChange,
}) => {
  return (
    <>
      <div className="flex gap-4 mt-4">
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-64">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-term">Current Term (Sep 1 - Dec 15)</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-quarter">Last Quarter</SelectItem>
            <SelectItem value="academic-year">Academic Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="student">Student Reports</SelectItem>
            <SelectItem value="merit">Merit Analysis</SelectItem>
            <SelectItem value="incident">Incident Reports</SelectItem>
            <SelectItem value="analytics">Analytics</SelectItem>
            <SelectItem value="staff">Staff Reports</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ReportFilters;
