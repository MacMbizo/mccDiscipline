
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Zap
} from 'lucide-react';
import SmartInterventionEngine from './SmartInterventionEngine';
import PredictiveModelingDashboard from '../analytics/PredictiveModelingDashboard';
import IntelligentEscalation from '../workflow/IntelligentEscalation';

interface AIDecisionSupportProps {
  className?: string;
}

const AIDecisionSupport: React.FC<AIDecisionSupportProps> = ({ className = "" }) => {
  const [activeInsights, setActiveInsights] = useState(true);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Command Center Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Brain className="h-6 w-6" />
            AI Decision Support Command Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">97.3%</div>
              <div className="text-sm text-gray-600">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.4s</div>
              <div className="text-sm text-gray-600">Avg Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">Intervention Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">156</div>
              <div className="text-sm text-gray-600">Decisions Today</div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Zap className="h-4 w-4 mr-2" />
              Run Full Analysis
            </Button>
            <Button size="sm" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Optimize Models
            </Button>
            <Button size="sm" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Performance
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="intervention" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="intervention">Smart Interventions</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Models</TabsTrigger>
          <TabsTrigger value="escalation">Auto Escalation</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="intervention">
          <SmartInterventionEngine />
        </TabsContent>

        <TabsContent value="predictive">
          <PredictiveModelingDashboard />
        </TabsContent>

        <TabsContent value="escalation">
          <IntelligentEscalation />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Real-time AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Real-time AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-blue-800">Behavioral Pattern Detected</div>
                      <p className="text-sm text-blue-600 mt-1">
                        AI has identified a 73% correlation between Monday morning incidents and weekend activities. 
                        Recommend implementing Monday wellness check-ins.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-blue-700">
                          Confidence: 87%
                        </Badge>
                        <Badge variant="outline" className="text-blue-700">
                          Impact: High
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-green-800">Intervention Success Prediction</div>
                      <p className="text-sm text-green-600 mt-1">
                        Current counseling approach for Student #247 shows 94% probability of success based on 
                        similar case patterns. Recommend continuing current strategy.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-green-700">
                          Confidence: 94%
                        </Badge>
                        <Badge variant="outline" className="text-green-700">
                          Action: Continue
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-orange-800">Resource Optimization Alert</div>
                      <p className="text-sm text-orange-600 mt-1">
                        AI recommends reallocating 2 counselors from low-activity periods to Thursday afternoons 
                        where incident prediction models show 40% increase likelihood.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-orange-700">
                          Efficiency Gain: 23%
                        </Badge>
                        <Badge variant="outline" className="text-orange-700">
                          Priority: Medium
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Behavioral Prediction Accuracy</span>
                      <span className="text-sm font-medium">97.3%</span>
                    </div>
                    <Progress value={97.3} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Intervention Success Rate</span>
                      <span className="text-sm font-medium">89.1%</span>
                    </div>
                    <Progress value={89.1} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Risk Assessment Precision</span>
                      <span className="text-sm font-medium">94.7%</span>
                    </div>
                    <Progress value={94.7} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Resource Optimization</span>
                      <span className="text-sm font-medium">76.8%</span>
                    </div>
                    <Progress value={76.8} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Processing Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2.4s</div>
                    <div className="text-sm text-gray-600">Avg Analysis Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">1,247</div>
                    <div className="text-sm text-gray-600">Decisions Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">23</div>
                    <div className="text-sm text-gray-600">Active Models</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">99.7%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDecisionSupport;
