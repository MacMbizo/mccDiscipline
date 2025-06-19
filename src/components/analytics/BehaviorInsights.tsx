
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { useStudents } from '@/hooks/useStudents';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Users,
  Calendar,
  Brain,
  Lightbulb
} from 'lucide-react';

interface BehaviorInsightsProps {
  className?: string;
}

const BehaviorInsights: React.FC<BehaviorInsightsProps> = ({ className = "" }) => {
  const { data: records = [] } = useBehaviorRecords();
  const { data: students = [] } = useStudents();

  // Calculate insights
  const insights = React.useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    // Recent trends
    const recentIncidents = records.filter(r => 
      r.type === 'incident' && new Date(r.timestamp || '') > thirtyDaysAgo
    );
    
    const recentMerits = records.filter(r => 
      r.type === 'merit' && new Date(r.timestamp || '') > thirtyDaysAgo
    );

    // Most common incident types
    const incidentTypes = recentIncidents.reduce((acc, incident) => {
      const type = incident.misdemeanor?.name || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topIncidentTypes = Object.entries(incidentTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    // Students at risk (high behavior scores)
    const studentsAtRisk = students
      .filter(s => (s.behavior_score || 0) > 7)
      .sort((a, b) => (b.behavior_score || 0) - (a.behavior_score || 0))
      .slice(0, 5);

    // Time patterns
    const timePatterns = recentIncidents.reduce((acc, incident) => {
      const hour = new Date(incident.timestamp || '').getHours();
      const period = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      acc[period] = (acc[period] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Improvement suggestions
    const suggestions = [];
    if (topIncidentTypes[0] && topIncidentTypes[0][1] > 5) {
      suggestions.push({
        type: 'focus',
        title: `Address ${topIncidentTypes[0][0]} incidents`,
        description: `${topIncidentTypes[0][1]} incidents this month. Consider targeted intervention.`
      });
    }
    
    if (studentsAtRisk.length > 3) {
      suggestions.push({
        type: 'intervention',
        title: 'Multiple students need support',
        description: `${studentsAtRisk.length} students have high behavior scores. Schedule counseling sessions.`
      });
    }

    const mostProblematicTime = Object.entries(timePatterns).sort(([,a], [,b]) => b - a)[0];
    if (mostProblematicTime && mostProblematicTime[1] > 10) {
      suggestions.push({
        type: 'schedule',
        title: `Increase supervision during ${mostProblematicTime[0].toLowerCase()}`,
        description: `${mostProblematicTime[1]} incidents occurred during this period.`
      });
    }

    return {
      totalIncidents: recentIncidents.length,
      totalMerits: recentMerits.length,
      topIncidentTypes,
      studentsAtRisk,
      timePatterns,
      suggestions
    };
  }, [records, students]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Incidents</p>
                <p className="text-2xl font-bold text-red-600">{insights.totalIncidents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Merit Awards</p>
                <p className="text-2xl font-bold text-green-600">{insights.totalMerits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">At Risk Students</p>
                <p className="text-2xl font-bold text-orange-600">{insights.studentsAtRisk.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Suggestions</p>
                <p className="text-2xl font-bold text-blue-600">{insights.suggestions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Incident Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Most Common Incidents (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.topIncidentTypes.map(([type, count], index) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={index === 0 ? 'destructive' : 'secondary'}>
                    #{index + 1}
                  </Badge>
                  <span className="font-medium">{type}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {count} incidents
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students at Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Students Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.studentsAtRisk.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-600">Grade {student.grade}</p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive">
                    {student.behavior_score?.toFixed(1)} Heat Score
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">{suggestion.title}</h4>
                    <p className="text-sm text-blue-700 mt-1">{suggestion.description}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
            
            {insights.suggestions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No immediate recommendations. Keep up the good work!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviorInsights;
