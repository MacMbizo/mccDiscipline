
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdvancedSearch, SearchResult } from '@/hooks/useAdvancedSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  Search, 
  Filter, 
  User, 
  AlertTriangle, 
  Award, 
  FileText,
  Calendar,
  MapPin,
  TrendingUp
} from 'lucide-react';

interface AdvancedSearchInterfaceProps {
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

const AdvancedSearchInterface: React.FC<AdvancedSearchInterfaceProps> = ({
  onResultSelect,
  className = ""
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const { 
    query, 
    setQuery, 
    filters, 
    updateFilters, 
    results, 
    isSearching, 
    resultCount 
  } = useAdvancedSearch();

  const debouncedQuery = useDebounce(query, 300);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'student': return User;
      case 'incident': return AlertTriangle;
      case 'merit': return Award;
      case 'misdemeanor': return FileText;
      default: return Search;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'incident': return 'bg-red-100 text-red-800';
      case 'merit': return 'bg-green-100 text-green-800';
      case 'misdemeanor': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      // Default navigation behavior
      console.log('Navigate to:', result);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students, incidents, merits, or policies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-blue-50' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Results Summary */}
          {isSearching && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{resultCount} results found</span>
              <div className="flex gap-2">
                {filters.types.map(type => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="bg-gray-50">
              <CardContent className="p-4 space-y-4">
                <Tabs defaultValue="types">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="types">Types</TabsTrigger>
                    <TabsTrigger value="dates">Dates</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="scores">Scores</TabsTrigger>
                  </TabsList>

                  <TabsContent value="types" className="space-y-3">
                    <h4 className="font-medium">Search In:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['student', 'incident', 'merit', 'misdemeanor'].map(type => (
                        <label key={type} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.types.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateFilters({ types: [...filters.types, type] });
                              } else {
                                updateFilters({ types: filters.types.filter(t => t !== type) });
                              }
                            }}
                          />
                          <span className="capitalize">{type}s</span>
                        </label>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="dates" className="space-y-3">
                    <h4 className="font-medium">Date Range:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm">From:</label>
                        <Input
                          type="date"
                          value={filters.dateRange?.start || ''}
                          onChange={(e) => updateFilters({
                            dateRange: { 
                              ...filters.dateRange, 
                              start: e.target.value,
                              end: filters.dateRange?.end || ''
                            }
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm">To:</label>
                        <Input
                          type="date"
                          value={filters.dateRange?.end || ''}
                          onChange={(e) => updateFilters({
                            dateRange: { 
                              ...filters.dateRange, 
                              start: filters.dateRange?.start || '',
                              end: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="space-y-3">
                    <h4 className="font-medium">Locations:</h4>
                    <div className="space-y-2">
                      {['Main School', 'Hostel'].map(location => (
                        <label key={location} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.locations?.includes(location) || false}
                            onChange={(e) => {
                              const currentLocations = filters.locations || [];
                              if (e.target.checked) {
                                updateFilters({ locations: [...currentLocations, location] });
                              } else {
                                updateFilters({ locations: currentLocations.filter(l => l !== location) });
                              }
                            }}
                          />
                          <MapPin className="h-4 w-4" />
                          <span>{location}</span>
                        </label>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="scores" className="space-y-3">
                    <h4 className="font-medium">Behavior Score Range:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm">Min Score:</label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={filters.minScore || ''}
                          onChange={(e) => updateFilters({ minScore: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Max Score:</label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={filters.maxScore || ''}
                          onChange={(e) => updateFilters({ maxScore: parseFloat(e.target.value) || 10 })}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {isSearching && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result) => {
                const IconComponent = getResultIcon(result.type);
                return (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">{result.title}</h4>
                            <p className="text-sm text-gray-600">{result.subtitle}</p>
                            <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                          </div>
                          <Badge className={getResultColor(result.type)}>
                            {result.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {results.length === 0 && query.trim() && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearchInterface;
