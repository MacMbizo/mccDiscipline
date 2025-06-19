
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  Lightbulb
} from 'lucide-react';

interface InterventionRecommendation {
  id: string;
  studentId: string;
  type: 'counseling' | 'mentoring' | 'academic_support' | 'behavioral_plan' | 'parent_meeting';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  reasoning: string[];
  estimatedSuccess: number;
  timeline: string;
  resources: string[];
  aiGenerated: boolean;
}

interface RiskAssessment {
  studentId: string;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  contributingFactors: string[];
  predictedOutcomes: string[];
  confidenceLevel: number;
  lastUpdated: string;
}

interface SmartInterventionEngineProps {
  studentId?: string;
  className?: string;
}

const SmartInterventionEngine: React.FC<SmartInterventionEngineProps> = ({
  studentId,
  className = ""
}) => {
  const [recommendations, setRecommendations] = useState<InterventionRecommendation[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock AI-generated recommendations
  useEffect(() => {
    const mockRecommendations: InterventionRecommendation[] = [
      {
        id: '1',
        studentId: 'student-123',
        type: 'counseling',
        priority: 'high',
        confidence: 87,
        reasoning: [
          'Student shows escalating behavioral patterns over past 3 weeks',
          'Similar students benefited from early counseling intervention (92% success rate)',
          'Optimal timing window identified based on schedule analysis'
        ],
        estimatedSuccess: 92,
        timeline: '1-2 weeks',
        resources: ['Counselor Sarah Johnson', 'Quiet Room B', 'Behavioral Assessment Tools'],
        aiGenerated: true
      },
      {
        id: '2',
        studentId: 'student-456',
        type: 'parent_meeting',
        priority: 'medium',
        confidence: 76,
        reasoning: [
          'Parent engagement strongly correlates with improvement in similar cases',
          'Student responds well to collaborative approaches',
          'Recent academic decline suggests home-school coordination needed'
        ],
        estimatedSuccess: 78,
        timeline: 'Within 1 week',
        resources: ['Conference Room A', 'Academic Progress Reports', 'Behavior Trend Analysis'],
        aiGenerated: true
      }
    ];

    const mockRiskAssessments: RiskAssessment[] = [
      {
        studentId: 'student-123',
        riskScore: 8.2,
        riskLevel: 'high',
        contributingFactors: [
          'Increasing incident frequency (+40% in last month)',
          'Academic performance decline',
          'Social isolation indicators',
          'Previous intervention success rate in profile'
        ],
        predictedOutcomes: [
          '75% chance of escalation without intervention',
          '23% chance of academic suspension',
          '92% improvement probability with recommended interventions'
        ],
        confidenceLevel: 89,
        lastUpdated: '2023-09-15T10:30:00Z'
      }
    ];

    setRecommendations(mockRecommendations);
    setRiskAssessments(mockRiskAssessments);
  }, [studentId]);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Smart Intervention Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              AI-powered behavioral analysis and intervention recommendations
            </p>
            <Button 
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-gray-600">Students Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Active Recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            AI Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskAssessments.map((assessment) => (
              <div key={assessment.studentId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold">Student ID: {assessment.studentId}</div>
                    <Badge className={getRiskLevelColor(assessment.riskLevel)}>
                      {assessment.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">{assessment.riskScore}/10</div>
                    <div className="text-xs text-gray-600">Risk Score</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">AI Confidence</span>
                    <span className="text-sm font-medium">{assessment.confidenceLevel}%</span>
                  </div>
                  <Progress value={assessment.confidenceLevel} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Contributing Factors</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {assessment.contributingFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Predicted Outcomes</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {assessment.predictedOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intervention Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            AI-Generated Intervention Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority.toUpperCase()}
                    </Badge>
                    <h3 className="font-semibold capitalize">
                      {recommendation.type.replace('_', ' ')}
                    </h3>
                    {recommendation.aiGenerated && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Success Rate</div>
                    <div className="text-lg font-bold text-green-600">{recommendation.estimatedSuccess}%</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">AI Confidence</span>
                    <span className="text-sm font-medium">{recommendation.confidence}%</span>
                  </div>
                  <Progress value={recommendation.confidence} className="h-2" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      AI Reasoning
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {recommendation.reasoning.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Timeline & Resources
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Timeline:</strong> {recommendation.timeline}
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {recommendation.resources.map((resource, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Target className="h-4 w-4 mr-2" />
                      Implement
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartInterventionEngine;
