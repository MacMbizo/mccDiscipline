
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target,
  DollarSign,
  Calendar,
  Award,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ROIMetric {
  category: string;
  investment: number;
  savings: number;
  roi: number;
  timeline: string;
}

interface BenchmarkData {
  metric: string;
  schoolValue: number;
  benchmarkValue: number;
  percentile: number;
  trend: 'up' | 'down' | 'stable';
}

interface EnterpriseAnalyticsProps {
  className?: string;
}

const EnterpriseAnalytics: React.FC<EnterpriseAnalyticsProps> = ({ className = "" }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('quarter');

  const roiData: ROIMetric[] = [
    {
      category: 'Early Intervention',
      investment: 15000,
      savings: 45000,
      roi: 200,
      timeline: 'Q1 2023'
    },
    {
      category: 'Staff Training',
      investment: 8000,
      savings: 22000,
      roi: 175,
      timeline: 'Q2 2023'
    },
    {
      category: 'Technology Implementation',
      investment: 25000,
      savings: 60000,
      roi: 140,
      timeline: 'Q3 2023'
    }
  ];

  const benchmarkData: BenchmarkData[] = [
    {
      metric: 'Incident Resolution Time',
      schoolValue: 2.3,
      benchmarkValue: 4.1,
      percentile: 85,
      trend: 'up'
    },
    {
      metric: 'Student Satisfaction',
      schoolValue: 8.7,
      benchmarkValue: 7.2,
      percentile: 78,
      trend: 'up'
    },
    {
      metric: 'Parent Engagement',
      schoolValue: 75,
      benchmarkValue: 68,
      percentile: 72,
      trend: 'stable'
    },
    {
      metric: 'Staff Efficiency',
      schoolValue: 92,
      benchmarkValue: 85,
      percentile: 81,
      trend: 'up'
    }
  ];

  const trendData = [
    { month: 'Jan', incidents: 45, interventions: 23, success: 87 },
    { month: 'Feb', incidents: 38, interventions: 28, success: 91 },
    { month: 'Mar', incidents: 42, interventions: 25, success: 89 },
    { month: 'Apr', incidents: 35, interventions: 30, success: 94 },
    { month: 'May', incidents: 29, interventions: 27, success: 96 },
    { month: 'Jun', incidents: 31, interventions: 22, success: 93 },
  ];

  const resourceAllocation = [
    { name: 'Counseling', value: 35, color: '#3b82f6' },
    { name: 'Prevention', value: 25, color: '#10b981' },
    { name: 'Monitoring', value: 20, color: '#f59e0b' },
    { name: 'Training', value: 12, color: '#8b5cf6' },
    { name: 'Administration', value: 8, color: '#ef4444' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Enterprise Analytics Dashboard
          </h2>
          <p className="text-gray-600">Advanced analytics, ROI tracking, and benchmark comparisons</p>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
          >
            Monthly
          </Button>
          <Button 
            size="sm" 
            variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('quarter')}
          >
            Quarterly
          </Button>
          <Button 
            size="sm" 
            variant={selectedPeriod === 'year' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('year')}
          >
            Yearly
          </Button>
        </div>
      </div>

      <Tabs defaultValue="roi" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="resources">Resource Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="roi" className="space-y-6">
          {/* ROI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total ROI</p>
                    <p className="text-2xl font-bold text-green-600">167%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cost Savings</p>
                    <p className="text-2xl font-bold text-blue-600">$127K</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Investment</p>
                    <p className="text-2xl font-bold text-purple-600">$48K</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payback Period</p>
                    <p className="text-2xl font-bold text-orange-600">8mo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>ROI by Investment Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roiData.map((item) => (
                  <div key={item.category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{item.category}</h3>
                      <Badge className="bg-green-100 text-green-800">
                        {item.roi}% ROI
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Investment</div>
                        <div className="font-medium">${item.investment.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Savings</div>
                        <div className="font-medium text-green-600">${item.savings.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Timeline</div>
                        <div className="font-medium">{item.timeline}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance vs. Industry Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {benchmarkData.map((item) => (
                  <div key={item.metric} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{item.metric}</h3>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(item.trend)}
                        <Badge variant="outline">
                          {item.percentile}th percentile
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Your School</div>
                        <div className="text-xl font-bold text-blue-600">{item.schoolValue}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Industry Average</div>
                        <div className="text-xl font-bold text-gray-600">{item.benchmarkValue}</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentile}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>6-Month Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="incidents" stroke="#ef4444" name="Incidents" />
                  <Line type="monotone" dataKey="interventions" stroke="#3b82f6" name="Interventions" />
                  <Line type="monotone" dataKey="success" stroke="#10b981" name="Success Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Key Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Declining Incident Rate</div>
                      <div className="text-sm text-gray-600">
                        35% reduction in behavioral incidents over 6 months
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Improved Success Rate</div>
                      <div className="text-sm text-gray-600">
                        Intervention success rate increased from 87% to 96%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Proactive Interventions</div>
                      <div className="text-sm text-gray-600">
                        30% increase in early intervention adoption
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-orange-800">Response Time</div>
                    <div className="text-sm text-orange-600">
                      Average response time increased slightly in May
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Staff Training</div>
                    <div className="text-sm text-blue-600">
                      Opportunity to enhance training in conflict de-escalation
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800">Parent Engagement</div>
                    <div className="text-sm text-purple-600">
                      Room for improvement in parent communication frequency
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={resourceAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {resourceAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Staff Utilization</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Budget Efficiency</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Technology Adoption</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Outcome Quality</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost-Benefit Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="investment" fill="#ef4444" name="Investment ($)" />
                  <Bar dataKey="savings" fill="#10b981" name="Savings ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseAnalytics;
