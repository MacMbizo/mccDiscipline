
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface PredictiveModel {
  id: string;
  name: string;
  type: 'behavioral_trend' | 'intervention_success' | 'resource_demand' | 'risk_escalation';
  accuracy: number;
  lastTrained: string;
  predictions: number;
  status: 'active' | 'training' | 'needs_update';
}

interface Forecast {
  period: string;
  incidents: number;
  merits: number;
  riskStudents: number;
  interventions: number;
  confidence: number;
}

interface HeatMapData {
  location: string;
  timeSlot: string;
  incidentRate: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface PredictiveModelingDashboardProps {
  className?: string;
}

const PredictiveModelingDashboard: React.FC<PredictiveModelingDashboardProps> = ({ className = "" }) => {
  const [selectedModel, setSelectedModel] = useState('behavioral_trend');
  const [timeRange, setTimeRange] = useState('6_months');

  const models: PredictiveModel[] = [
    {
      id: 'behavioral_trend',
      name: 'Behavioral Trend Predictor',
      type: 'behavioral_trend',
      accuracy: 94.2,
      lastTrained: '2023-09-14',
      predictions: 1247,
      status: 'active'
    },
    {
      id: 'intervention_success',
      name: 'Intervention Success Model',
      type: 'intervention_success',
      accuracy: 87.8,
      lastTrained: '2023-09-12',
      predictions: 834,
      status: 'active'
    },
    {
      id: 'resource_demand',
      name: 'Resource Demand Forecaster',
      type: 'resource_demand',
      accuracy: 91.5,
      lastTrained: '2023-09-13',
      predictions: 456,
      status: 'training'
    }
  ];

  const forecastData: Forecast[] = [
    { period: 'Week 1', incidents: 12, merits: 45, riskStudents: 8, interventions: 6, confidence: 92 },
    { period: 'Week 2', incidents: 15, merits: 38, riskStudents: 11, interventions: 8, confidence: 89 },
    { period: 'Week 3', incidents: 18, merits: 42, riskStudents: 14, interventions: 10, confidence: 85 },
    { period: 'Week 4', incidents: 22, merits: 35, riskStudents: 18, interventions: 14, confidence: 81 },
  ];

  const heatMapData: HeatMapData[] = [
    { location: 'Main Hall', timeSlot: '08:00', incidentRate: 0.3, riskLevel: 'low' },
    { location: 'Main Hall', timeSlot: '10:00', incidentRate: 0.8, riskLevel: 'medium' },
    { location: 'Main Hall', timeSlot: '12:00', incidentRate: 1.5, riskLevel: 'high' },
    { location: 'Cafeteria', timeSlot: '08:00', incidentRate: 0.1, riskLevel: 'low' },
    { location: 'Cafeteria', timeSlot: '10:00', incidentRate: 0.4, riskLevel: 'low' },
    { location: 'Cafeteria', timeSlot: '12:00', incidentRate: 2.3, riskLevel: 'critical' },
    { location: 'Playground', timeSlot: '08:00', incidentRate: 0.2, riskLevel: 'low' },
    { location: 'Playground', timeSlot: '10:00', incidentRate: 1.2, riskLevel: 'high' },
    { location: 'Playground', timeSlot: '12:00', incidentRate: 1.8, riskLevel: 'high' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'needs_update': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-200';
      case 'medium': return 'bg-yellow-200';
      case 'high': return 'bg-orange-200';
      case 'critical': return 'bg-red-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Predictive Modeling Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Advanced AI models forecast behavioral trends, intervention success, and resource needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4</div>
              <div className="text-sm text-gray-600">Active Models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">92.1%</div>
              <div className="text-sm text-gray-600">Avg Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2,537</div>
              <div className="text-sm text-gray-600">Predictions Made</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">86%</div>
              <div className="text-sm text-gray-600">Intervention Success</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="forecasts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="heatmaps">Heat Maps</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Behavioral Trend Forecasts
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">4 Weeks</Button>
                  <Button size="sm" variant="outline">3 Months</Button>
                  <Button size="sm">6 Months</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="incidents" stroke="#dc2626" name="Predicted Incidents" />
                  <Line type="monotone" dataKey="merits" stroke="#16a34a" name="Predicted Merits" />
                  <Line type="monotone" dataKey="riskStudents" stroke="#ea580c" name="Students at Risk" />
                  <Line type="monotone" dataKey="interventions" stroke="#7c3aed" name="Required Interventions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Risk Escalation Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="riskStudents" stroke="#ea580c" fill="#fed7aa" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Intervention Demand
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="interventions" fill="#7c3aed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-sm">
                    {model.name}
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Accuracy</span>
                        <span className="text-sm font-medium">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Last Trained</div>
                        <div className="font-medium">{model.lastTrained}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Predictions</div>
                        <div className="font-medium">{model.predictions.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Activity className="h-4 w-4 mr-2" />
                        Retrain
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="heatmaps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Behavioral Incident Heat Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm">
                  <span>Risk Level:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-200 rounded"></div>
                    <span>High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span>Critical</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="font-medium text-sm">Location / Time</div>
                <div className="font-medium text-sm text-center">08:00</div>
                <div className="font-medium text-sm text-center">10:00</div>
                <div className="font-medium text-sm text-center">12:00</div>
                
                {['Main Hall', 'Cafeteria', 'Playground'].map((location) => (
                  <React.Fragment key={location}>
                    <div className="font-medium text-sm py-2">{location}</div>
                    {['08:00', '10:00', '12:00'].map((timeSlot) => {
                      const data = heatMapData.find(d => d.location === location && d.timeSlot === timeSlot);
                      return (
                        <div 
                          key={`${location}-${timeSlot}`}
                          className={`p-3 rounded text-center text-sm font-medium ${getRiskColor(data?.riskLevel || 'low')}`}
                        >
                          {data?.incidentRate || 0}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Improving Trend</div>
                      <div className="text-sm text-gray-600">
                        Overall behavioral incidents predicted to decrease by 15% over next month
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Risk Pattern Detected</div>
                      <div className="text-sm text-gray-600">
                        Cafeteria incidents spike during lunch hours - recommend increased supervision
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Intervention Success</div>
                      <div className="text-sm text-gray-600">
                        Early counseling interventions show 92% success rate in preventing escalation
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800">Optimize Resource Allocation</div>
                    <div className="text-sm text-purple-600">
                      Deploy 2 additional supervisors to cafeteria during peak hours (12:00-13:00)
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Proactive Intervention</div>
                    <div className="text-sm text-blue-600">
                      Schedule counseling sessions for 8 students identified as high-risk this week
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">Merit System Enhancement</div>
                    <div className="text-sm text-green-600">
                      Increase merit rewards during morning hours to maintain positive momentum
                    </div>
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

export default PredictiveModelingDashboard;
