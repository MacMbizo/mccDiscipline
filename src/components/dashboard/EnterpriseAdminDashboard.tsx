
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  BarChart3, 
  Zap, 
  Target,
  Settings,
  Users,
  Shield,
  Database
} from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import GlobalSearch from '@/components/common/GlobalSearch';
import AIDecisionSupport from '@/components/ai/AIDecisionSupport';
import EnterpriseAnalytics from '@/components/analytics/EnterpriseAnalytics';
import IntelligentEscalation from '@/components/workflow/IntelligentEscalation';

const EnterpriseAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('ai-command');

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Enterprise Admin Dashboard"
        userName={user.name}
        onLogout={logout}
      />

      <div className="p-4 lg:p-6 space-y-6 max-w-full">
        {/* Welcome Section with Global Search */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4 lg:p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold mb-2">
                Enterprise Command Center
              </h1>
              <p className="text-purple-100 text-sm lg:text-base">
                AI-powered behavioral intelligence, predictive analytics, and automated workflows
              </p>
            </div>
            <div className="w-full lg:w-96">
              <GlobalSearch />
            </div>
          </div>
        </div>

        {/* AI-Powered Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2 border-purple-200 hover:bg-purple-50"
            onClick={() => setActiveTab('ai-command')}
          >
            <Brain className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
            <span className="text-xs lg:text-sm">AI Command</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2 border-blue-200 hover:bg-blue-50"
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
            <span className="text-xs lg:text-sm">Analytics</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2 border-orange-200 hover:bg-orange-50"
            onClick={() => setActiveTab('automation')}
          >
            <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
            <span className="text-xs lg:text-sm">Automation</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2 border-green-200 hover:bg-green-50"
            onClick={() => setActiveTab('interventions')}
          >
            <Target className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
            <span className="text-xs lg:text-sm">Interventions</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2 border-gray-200 hover:bg-gray-50"
            onClick={() => setActiveTab('system')}
          >
            <Settings className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
            <span className="text-xs lg:text-sm">System</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2 border-red-200 hover:bg-red-50"
            onClick={() => setActiveTab('security')}
          >
            <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
            <span className="text-xs lg:text-sm">Security</span>
          </Button>
        </div>

        {/* Enterprise Intelligence Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-6 w-full min-w-max lg:min-w-0">
              <TabsTrigger value="ai-command" className="text-xs lg:text-sm">AI Command</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs lg:text-sm">Enterprise Analytics</TabsTrigger>
              <TabsTrigger value="automation" className="text-xs lg:text-sm">Smart Automation</TabsTrigger>
              <TabsTrigger value="interventions" className="text-xs lg:text-sm">AI Interventions</TabsTrigger>
              <TabsTrigger value="system" className="text-xs lg:text-sm">System Control</TabsTrigger>
              <TabsTrigger value="security" className="text-xs lg:text-sm">Security Center</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ai-command" className="space-y-6">
            <AIDecisionSupport />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <EnterpriseAnalytics />
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <IntelligentEscalation />
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                    <Brain className="h-4 w-4 lg:h-5 lg:w-5" />
                    AI Intervention Engine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">23</div>
                      <div className="text-sm text-gray-600">Active AI Models</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">97.3%</div>
                      <div className="text-sm text-gray-600">Prediction Accuracy</div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Brain className="h-4 w-4 mr-2" />
                      View AI Insights
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                    <Target className="h-4 w-4 lg:h-5 lg:w-5" />
                    Intervention Success
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">156</div>
                      <div className="text-sm text-gray-600">Active Cases</div>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      Manage Interventions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                    <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">2.4s</div>
                      <div className="text-sm text-gray-600">Avg Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">94%</div>
                      <div className="text-sm text-gray-600">Staff Satisfaction</div>
                    </div>
                    <Button className="w-full" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Metrics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full justify-start" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Database Management
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      User Management
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">System Uptime</span>
                        <span className="text-sm font-medium">99.7%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.7%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Database Performance</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">AI Model Health</span>
                        <span className="text-sm font-medium">98%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Compliance Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Data Encrypted</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">Monitoring</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">Security Incidents</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">GDPR</div>
                    <div className="text-sm text-gray-600">Compliant</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnterpriseAdminDashboard;
