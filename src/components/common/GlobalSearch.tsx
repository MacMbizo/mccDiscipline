
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
import { Search, User, FileText, AlertTriangle, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  type: 'student' | 'incident' | 'merit' | 'misdemeanor';
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
      // Search students
      const { data: students } = await supabase
        .from('students')
        .select('*')
        .or(`name.ilike.%${query}%,student_id.ilike.%${query}%,grade.ilike.%${query}%`)
        .limit(10);

      students?.forEach(student => {
        searchResults.push({
          id: student.id,
          type: 'student',
          title: student.name,
          subtitle: `Student ID: ${student.student_id}`,
          metadata: `${student.grade} • Heat Score: ${student.behavior_score?.toFixed(1) || '0.0'}`,
          data: student,
        });
      });

      // Search behavior records
      const { data: records } = await supabase
        .from('behavior_records')
        .select(`
          *,
          student:students(name, student_id),
          misdemeanor:misdemeanors(name)
        `)
        .ilike('description', `%${query}%`)
        .limit(10);

      records?.forEach(record => {
        searchResults.push({
          id: record.id,
          type: record.type as 'incident' | 'merit',
          title: record.type === 'incident' ? 'Incident Report' : 'Merit Award',
          subtitle: record.description,
          metadata: `${record.student?.name} • ${new Date(record.timestamp!).toLocaleDateString()}`,
          data: record,
        });
      });

      // Search misdemeanors
      const { data: misdemeanors } = await supabase
        .from('misdemeanors')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(5);

      misdemeanors?.forEach(misdemeanor => {
        searchResults.push({
          id: misdemeanor.id,
          type: 'misdemeanor',
          title: misdemeanor.name,
          subtitle: `${misdemeanor.location} • Category: ${misdemeanor.category || 'General'}`,
          metadata: `Severity: ${misdemeanor.severity_level || 1}`,
          data: misdemeanor,
        });
      });

      setResults(searchResults);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-muted-foreground">
          <Search className="mr-2 h-4 w-4" />
          Search students, records, policies...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Global Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search across all data..."
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
                <p className="mt-2 text-sm text-gray-600">Searching...</p>
              </div>
            )}

            {!isLoading && searchTerm.length >= 2 && results.length === 0 && (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">No results found for "{searchTerm}"</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="space-y-2">
                {results.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      // Handle result click - navigate to appropriate page
                      console.log('Selected result:', result);
                      setIsOpen(false);
                    }}
                  >
                    <div className="mt-1">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{result.title}</h4>
                        <Badge className={`text-xs ${getResultBadgeColor(result.type)}`}>
                          {result.type}
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
                  Search students, behavior records, and policies
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
