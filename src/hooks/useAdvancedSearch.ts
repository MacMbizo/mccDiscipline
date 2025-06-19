
import { useState, useMemo } from 'react';
import { useStudents } from './useStudents';
import { useBehaviorRecords } from './useBehaviorRecords';
import { useMisdemeanors } from './useMisdemeanors';

export interface SearchResult {
  id: string;
  type: 'student' | 'incident' | 'merit' | 'misdemeanor';
  title: string;
  subtitle: string;
  description: string;
  metadata: Record<string, any>;
  score: number; // relevance score
}

export interface SearchFilters {
  types: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  grades?: string[];
  locations?: string[];
  minScore?: number;
  maxScore?: number;
}

export const useAdvancedSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    types: ['student', 'incident', 'merit', 'misdemeanor']
  });
  
  const { data: students = [] } = useStudents();
  const { data: behaviorRecords = [] } = useBehaviorRecords();
  const { data: misdemeanors = [] } = useMisdemeanors();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search students
    if (filters.types.includes('student')) {
      students.forEach(student => {
        let score = 0;
        
        // Name match (highest priority)
        if (student.name.toLowerCase().includes(searchTerm)) {
          score += 100;
        }
        
        // Student ID match
        if (student.student_id.toLowerCase().includes(searchTerm)) {
          score += 80;
        }
        
        // Grade match
        if (student.grade.toLowerCase().includes(searchTerm)) {
          score += 40;
        }

        // Apply filters
        if (filters.grades && !filters.grades.includes(student.grade)) {
          score = 0;
        }

        if (filters.minScore && (student.behavior_score || 0) < filters.minScore) {
          score = 0;
        }

        if (filters.maxScore && (student.behavior_score || 0) > filters.maxScore) {
          score = 0;
        }

        if (score > 0) {
          results.push({
            id: student.id,
            type: 'student',
            title: student.name,
            subtitle: `Grade ${student.grade} • ID: ${student.student_id}`,
            description: `Behavior Score: ${student.behavior_score?.toFixed(1) || 'N/A'}`,
            metadata: student,
            score
          });
        }
      });
    }

    // Search behavior records (incidents and merits)
    behaviorRecords.forEach(record => {
      const isIncident = record.type === 'incident';
      const isMerit = record.type === 'merit';
      
      if ((!isIncident || !filters.types.includes('incident')) && 
          (!isMerit || !filters.types.includes('merit'))) {
        return;
      }

      let score = 0;

      // Description match
      if (record.description.toLowerCase().includes(searchTerm)) {
        score += 60;
      }

      // Misdemeanor name match (for incidents)
      if (isIncident && record.misdemeanor?.name.toLowerCase().includes(searchTerm)) {
        score += 80;
      }

      // Location match
      if (record.location?.toLowerCase().includes(searchTerm)) {
        score += 40;
      }

      // Student name match
      if (record.student?.name.toLowerCase().includes(searchTerm)) {
        score += 50;
      }

      // Apply filters
      if (filters.locations && record.location && !filters.locations.includes(record.location)) {
        score = 0;
      }

      if (filters.dateRange) {
        const recordDate = new Date(record.timestamp || '');
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        
        if (recordDate < startDate || recordDate > endDate) {
          score = 0;
        }
      }

      if (score > 0) {
        results.push({
          id: record.id,
          type: record.type as 'incident' | 'merit',
          title: isIncident ? record.misdemeanor?.name || 'Incident' : `${record.merit_tier} Merit`,
          subtitle: `${record.student?.name} • ${record.location}`,
          description: record.description,
          metadata: record,
          score
        });
      }
    });

    // Search misdemeanors
    if (filters.types.includes('misdemeanor')) {
      misdemeanors.forEach(misdemeanor => {
        let score = 0;

        // Name match
        if (misdemeanor.name.toLowerCase().includes(searchTerm)) {
          score += 100;
        }

        // Location match
        if (misdemeanor.location.toLowerCase().includes(searchTerm)) {
          score += 60;
        }

        // Category match
        if (misdemeanor.category?.toLowerCase().includes(searchTerm)) {
          score += 40;
        }

        // Apply filters
        if (filters.locations && !filters.locations.includes(misdemeanor.location)) {
          score = 0;
        }

        if (score > 0) {
          results.push({
            id: misdemeanor.id,
            type: 'misdemeanor',
            title: misdemeanor.name,
            subtitle: `${misdemeanor.location} • Level ${misdemeanor.severity_level || 1}`,
            description: misdemeanor.category || 'Misdemeanor policy',
            metadata: misdemeanor,
            score
          });
        }
      });
    }

    // Sort by relevance score
    return results.sort((a, b) => b.score - a.score);
  }, [query, filters, students, behaviorRecords, misdemeanors]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    query,
    setQuery,
    filters,
    updateFilters,
    results: searchResults,
    isSearching: query.trim().length > 0,
    resultCount: searchResults.length
  };
};
