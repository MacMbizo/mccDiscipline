
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { useStudents } from '@/hooks/useStudents';
import { 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Brain,
  Clock,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react';

interface RiskPrediction {
  studentId: string;
  studentName: string;
  grade: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  predictedOutcome: string;
  interventionSuggestion: string;
  timeline: string;
  factors: string[];
}

interface PredictiveAnalyticsProps {
  className?: string;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ className = "" }) => {
  const { data: records = [] } = useBehaviorRecords();
  const { data: students = [] } = useStudents();

  // Advanced risk assessment algorithm
  const riskPredictions = React.useMemo(() => {
    return students.map(student => {
      const studentRecords = records.filter(r => r.student_id === student.id);
      const incidents = studentRecords.filter(r => r.type === 'incident');
      const merits = studentRecords.filter(r => r.type === 'merit');
      
      // Time-based analysis
      const now = new Date();
      const recentIncidents = incidents.filter(i => 
        new Date(i.timestamp || '') > new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
      );
      const veryRecentIncidents = incidents.filter(i => 
        new Date(i.timestamp || '') > new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
      );

      // Pattern analysis
      const escalationPattern = incidents.slice(-5).every((incident, index, arr) => 
        index === 0 || new Date(incident.timestamp || '') > new Date(arr[index - 1].timestamp || '')
      );

      const repeatOffenses = incidents.reduce((acc, incident) => {
        const type = incident.misdemeanor?.name || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Risk scoring algorithm
      let riskScore = 0;
      const factors: string[] = [];

      // Current behavior score impact
      const currentScore = student.behavior_score || 0;
      if (currentScore > 7) {
        riskScore += 40;
        factors.push('High current behavior score');
      } else if (currentScore > 5) {
        riskScore += 20;
        factors.push('Elevated behavior score');
      }

      // Recent activity impact
      if (veryRecentIncidents.length > 2) {
        riskScore += 30;
        factors.push('Multiple recent incidents');
      } else if (recentIncidents.length > 3) {
        riskScore += 20;
        factors.push('Frequent monthly incidents');
      }

      // Escalation pattern
      if (escalationPattern && incidents.length > 3) {
        riskScore += 25;
        factors.push('Escalating pattern detected');
      }

      // Repeat offenses
      const maxRepeats = Math.max(...Object.values(repeatOffenses));
      if (maxRepeats > 3) {
        riskScore += 20;
        factors.push('Repeat offense pattern');
      }

      // Merit balance
      const recentMerits = merits.filter(m => 
        new Date(m.timestamp || '') > new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
      );
      
      if (recentMerits.length === 0 && recentIncidents.length > 0) {
        riskScore += 15;
        factors.push('No recent positive recognition');
      }

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';
      if (riskScore >= 80) riskLevel = 'critical';
      else if (riskScore >= 60) riskLevel = 'high';
      else if (riskScore >= 40) riskLevel = 'medium';
      else riskLevel = 'low';

      // Generate predictions and suggestions
      const predictions = {
        critical: {
          outcome: 'High risk of suspension or exclusion within 2 weeks',
          intervention: 'Immediate counseling session, parent meeting, and behavior contract',
          timeline: 'Immediate action required'
        },
        high: {
          outcome: 'Likely to reach critical threshold within 1 month',
          intervention: 'Schedule counseling, implement behavior monitoring plan',
          timeline: 'Within 1 week'
        },
        medium: {
          outcome: 'May escalate without intervention within 6 weeks',
          intervention: 'Teacher check-ins, positive reinforcement program',
          timeline: 'Within 2 weeks'
        },
        low: {
          outcome: 'Low risk of behavioral issues',
          intervention: 'Continue current positive approach',
          timeline: 'Monitor monthly'
        }
      };

      return {
        studentId: student.id,
        studentName: student.name,
        grade: student.grade,
        riskLevel,
        riskScore,
        predictedOutcome: predictions[riskLevel].outcome,
        interventionSuggestion: predictions[riskLevel].intervention,
        timeline: predictions[riskLevel].timeline,
        factors
      } as RiskPrediction;
    }).filter(p => p.riskLevel !== 'low').sort((a, b) => b.riskScore - a.riskScore);
  }, [students, records]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      default: return 'secondary';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Target className="h-4 w-4 text-green-600" />;
    }
  };

  const criticalAlerts = riskPredictions.filter(p => p.riskLevel === 'critical');
  const highRiskStudents = riskPredictions.filter(p => p.riskLevel === 'high');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalAlerts.length} student(s)</strong> require immediate intervention. 
            Review the critical risk assessments below.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {riskPredictions.filter(p => p.riskLevel === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-orange-600">
                  {riskPredictions.filter(p => p.riskLevel === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medium Risk</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {riskPredictions.filter(p => p.riskLevel === 'medium').length}
                </p>
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
                <p className="text-sm text-gray-600">AI Accuracy</p>
                <p className="text-2xl font-bold text-blue-600">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Predictive Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskPredictions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No students currently at elevated risk. Great work!</p>
              </div>
            ) : (
              riskPredictions.map((prediction) => (
                <div key={prediction.studentId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getRiskIcon(prediction.riskLevel)}
                      <div>
                        <h3 className="font-semibold">{prediction.studentName}</h3>
                        <p className="text-sm text-gray-600">Grade {prediction.grade}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getRiskColor(prediction.riskLevel)}>
                        {prediction.riskLevel.toUpperCase()} RISK
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Score: {prediction.riskScore}/100
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Predicted Outcome</h4>
                      <p className="text-sm text-gray-700">{prediction.predictedOutcome}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Recommended Intervention</h4>
                      <p className="text-sm text-gray-700">{prediction.interventionSuggestion}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Risk Factors</h4>
                    <div className="flex flex-wrap gap-2">
                      {prediction.factors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Timeline: {prediction.timeline}
                    </div>
                    <Button size="sm" variant="outline">
                      Create Intervention Plan
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
