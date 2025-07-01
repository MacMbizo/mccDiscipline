
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, User, FileText, AlertTriangle, Award, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  type: 'student' | 'incident' | 'merit' | 'misdemeanor' | 'shadow_child';
  title: string;
  subtitle: string;
  metadata?: string;
  data: any;
}

const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      performSearch(debouncedSearchTerm);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Enhanced student search with better filters and sorting
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          shadow_parent_assignments!inner(
            shadow_parent_id,
            shadow_parent:profiles!shadow_parent_id(name)
          )
        `)
        .or(`name.ilike.%${query}%,student_id.ilike.%${query}%,grade.ilike.%${query}%`)
        .eq('shadow_parent_assignments.is_active', true)
        .order('name')
        .limit(20);

      // Also search all students (not just those with shadow parents)
      const { data: allStudents, error: allStudentsError } = await supabase
        .from('students')
        .select('*')
        .or(`name.ilike.%${query}%,student_id.ilike.%${query}%,grade.ilike.%${query}%`)
        .order('name')
        .limit(30);

      if (allStudentsError) {
        console.error('Error searching all students:', allStudentsError);
      } else {
        allStudents?.forEach(student => {
          searchResults.push({
            id: student.id,
            type: 'student',
            title: student.name,
            subtitle: `Student ID: ${student.student_id} • ${student.grade}`,
            metadata: `Heat Score: ${student.behavior_score?.toFixed(1) || '0.0'} • ${student.boarding_status || 'Day Scholar'}`,
            data: student,
          });
        });
      }

      // Add shadow children with special marking
      if (students && !studentsError) {
        students.forEach(student => {
          const shadowParentName = student.shadow_parent_assignments?.[0]?.shadow_parent?.name;
          searchResults.push({
            id: `shadow_${student.id}`,
            type: 'shadow_child',
            title: student.name,
            subtitle: `Shadow Child • ${student.grade}`,
            metadata: `Shadow Parent: ${shadowParentName || 'Unknown'} • Heat Score: ${student.behavior_score?.toFixed(1) || '0.0'}`,
            data: student,
          });
        });
      }

      // Search behavior records with enhanced context
      const { data: records, error: recordsError } = await supabase
        .from('behavior_records')
        .select(`
          *,
          student:students(name, student_id, grade),
          misdemeanor:misdemeanors(name),
          reporter:profiles(name)
        `)
        .or(`description.ilike.%${query}%,sanction.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (recordsError) {
        console.error('Error searching records:', recordsError);
      } else {
        records?.forEach(record => {
          searchResults.push({
            id: record.id,
            type: record.type as 'incident' | 'merit',
            title: record.type === 'incident' ? 'Incident Report' : 'Merit Award',
            subtitle: record.description || 'No description',
            metadata: `${record.student?.name} (${record.student?.grade}) • ${new Date(record.timestamp!).toLocaleDateString()} • Reported by: ${record.reporter?.name || 'Unknown'}`,
            data: record,
          });
        });
      }

      // Search misdemeanors
      const { data: misdemeanors, error: misdemeanorsError } = await supabase
        .from('misdemeanors')
        .select('*')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .eq('status', 'active')
        .order('name')
        .limit(15);

      if (misdemeanorsError) {
        console.error('Error searching misdemeanors:', misdemeanorsError);
      } else {
        misdemeanors?.forEach(misdemeanor => {
          searchResults.push({
            id: misdemeanor.id,
            type: 'misdemeanor',
            title: misdemeanor.name,
            subtitle: `${misdemeanor.location} • Category: ${misdemeanor.category || 'General'}`,
            metadata: `Severity Level: ${misdemeanor.severity_level || 1}`,
            data: misdemeanor,
          });
        });
      }

      // Remove duplicates and sort results by relevance
      const uniqueResults = searchResults.filter((result, index, self) => 
        index === self.findIndex(r => r.id === result.id && r.type === result.type)
      );

      uniqueResults.sort((a, b) => {
        // Prioritize shadow children, then students, then other types
        if (a.type === 'shadow_child' && b.type !== 'shadow_child') return -1;
        if (a.type !== 'shadow_child' && b.type === 'shadow_child') return 1;
        if (a.type === 'student' && b.type !== 'student') return -1;
        if (a.type !== 'student' && b.type === 'student') return 1;
        return a.title.localeCompare(b.title);
      });

      setResults(uniqueResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <User className="h-4 w-4" />;
      case 'shadow_child':
        return <Heart className="h-4 w-4 text-pink-600" />;
      case 'incident':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'merit':
        return <Award className="h-4 w-4 text-green-600" />;
      case 'misdemeanor':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getResultBadgeColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'shadow_child':
        return 'bg-pink-100 text-pink-800';
      case 'incident':
        return 'bg-red-100 text-red-800';
      case 'merit':
        return 'bg-green-100 text-green-800';
      case 'misdemeanor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate to appropriate page based on result type
    if (result.type === 'student' || result.type === 'shadow_child') {
      console.log('Navigate to student profile:', result.data);
    } else if (result.type === 'incident' || result.type === 'merit') {
      console.log('Navigate to behavior record:', result.data);
    } else if (result.type === 'misdemeanor') {
      console.log('Navigate to misdemeanor policy:', result.data);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-muted-foreground">
          <Search className="mr-2 h-4 w-4" />
          Search students, shadow children, records...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Enhanced Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students, shadow children, records, policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">Searching all records...</p>
              </div>
            )}

            {!isLoading && searchTerm.length >= 2 && results.length === 0 && (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">No results found for "{searchTerm}"</p>
                <p className="text-xs text-gray-500 mt-1">
                  Try searching for student names, IDs, behavior records, or policies
                </p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
                {results.map((result, index) => (
                  <div
                    key={`${result.type}-${result.id}-${index}`}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="mt-1">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{result.title}</h4>
                        <Badge className={`text-xs ${getResultBadgeColor(result.type)}`}>
                          {result.type === 'shadow_child' ? 'Shadow Child' : result.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{result.subtitle}</p>
                      {result.metadata && (
                        <p className="text-xs text-gray-500 mt-1">{result.metadata}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchTerm.length < 2 && (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Type at least 2 characters to search
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Search all students, shadow children, behavior records, and policies
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
