import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  Database,
  Eye,
  Search,
  Plus,
  Brain,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import StudentAnalytics from '@/components/analytics/StudentAnalytics';
import ReportsAndAnalytics from '@/components/analytics/ReportsAndAnalytics';
import BehaviorInsights from '@/components/analytics/BehaviorInsights';
import PredictiveAnalytics from '@/components/analytics/PredictiveAnalytics';
import StudentEngagement from '@/components/engagement/StudentEngagement';
import AutomationWorkflows from '@/components/workflow/AutomationWorkflows';
import UserManagement from '@/components/admin/UserManagement';
import SystemConfiguration from '@/components/admin/SystemConfiguration';
import DataManagement from '@/components/admin/DataManagement';
import AuditLogs from '@/components/admin/AuditLogs';
import GlobalSearch from '@/components/common/GlobalSearch';
import IncidentForm from '@/components/forms/IncidentForm';
import MeritForm from '@/components/forms/MeritForm';
import StudentManagement from '@/components/admin/StudentManagement';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import EnterpriseAnalytics from '@/components/analytics/EnterpriseAnalytics';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Admin Dashboard"
        userName={user.name}
        onLogout={logout}
      />

      <div className="p-4 lg:p-6 space-y-6 max-w-full">
        {/* Welcome Section with Global Search */}
        <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-blue-900 mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Advanced behavioral analytics, predictive insights, and intelligent automation at your fingertips.
              </p>
            </div>
            <div className="w-full lg:w-96">
              <GlobalSearch />
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 lg:h-24 flex-col gap-2">
                <Plus className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
                <span className="text-xs lg:text-sm">Log Incident</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Log New Incident</DialogTitle>
              </DialogHeader>
              <IncidentForm />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 lg:h-24 flex-col gap-2">
                <Plus className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                <span className="text-xs lg:text-sm">Award Merit</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Award Merit Points</DialogTitle>
              </DialogHeader>
              <MeritForm />
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2"
            onClick={() => setActiveTab('predictive')}
          >
            <Brain className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
            <span className="text-xs lg:text-sm">AI Insights</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2"
            onClick={() => setActiveTab('automation')}
          >
            <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
            <span className="text-xs lg:text-sm">Automation</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2"
            onClick={() => setActiveTab('engagement')}
          >
            <Trophy className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600" />
            <span className="text-xs lg:text-sm">Engagement</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2"
            onClick={() => setActiveTab('reports')}
          >
            <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
            <span className="text-xs lg:text-sm">Reports</span>
          </Button>
        </div>

        {/* Enhanced Tabbed Interface - Mobile Optimized */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-10 w-full min-w-max lg:min-w-0">
              <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="insights" className="text-xs lg:text-sm">AI Insights</TabsTrigger>
              <TabsTrigger value="predictive" className="text-xs lg:text-sm">Predictive</TabsTrigger>
              <TabsTrigger value="automation" className="text-xs lg:text-sm">Automation</TabsTrigger>
              <TabsTrigger value="engagement" className="text-xs lg:text-sm">Engagement</TabsTrigger>
              <TabsTrigger value="reports" className="text-xs lg:text-sm">Reports</TabsTrigger>
              <TabsTrigger value="enterprise" className="text-xs lg:text-sm">Enterprise</TabsTrigger>
              <TabsTrigger value="users" className="text-xs lg:text-sm">Users</TabsTrigger>
              <TabsTrigger value="system" className="text-xs lg:text-sm">System</TabsTrigger>
              <TabsTrigger value="audit" className="text-xs lg:text-sm">Audit</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                    <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
                    System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentAnalytics />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                    <Brain className="h-4 w-4 lg:h-5 lg:w-5" />
                    AI Intelligence Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('predictive')}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Predictive Analytics
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('insights')}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Behavioral Insights
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('automation')}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Smart Automation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                    <Database className="h-4 w-4 lg:h-5 lg:w-5" />
                    Quick Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('system')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Configuration
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('engagement')}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Student Engagement
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('audit')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Audit Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <BehaviorInsights />
          </TabsContent>

          <TabsContent value="predictive">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationWorkflows />
          </TabsContent>

          <TabsContent value="engagement">
            <StudentEngagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsAndAnalytics />
          </TabsContent>

          <TabsContent value="enterprise">
            <EnterpriseAnalytics />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SystemConfiguration />
              <DataManagement />
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
