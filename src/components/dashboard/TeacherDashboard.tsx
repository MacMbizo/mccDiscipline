
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Users, FileText, Plus, Award, AlertTriangle, Heart, Bell } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import QuickActionCards from './QuickActionCards';
import RecentActivityCard from './RecentActivityCard';
import HeatBar from '@/components/common/HeatBar';
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview';
import BehaviorChart from '@/components/analytics/BehaviorChart';
import IncidentForm from '@/components/forms/IncidentForm';
import MeritForm from '@/components/forms/MeritForm';
import GlobalSearch from '@/components/common/GlobalSearch';
import ShadowParentSection from './ShadowParentSection';
import ShadowAlertsSection from './ShadowAlertsSection';
import ResponsiveContainer from '@/components/mobile/ResponsiveContainer';
import ResponsiveGrid from '@/components/mobile/ResponsiveGrid';

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  console.log('TeacherDashboard rendering for user:', user?.name);

  if (!user) {
    console.log('No user in TeacherDashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Teacher Dashboard"
        userName={user.name}
        onLogout={logout}
      />

      <ResponsiveContainer className="py-4 lg:py-6 space-y-6">
        {/* Welcome Section with Enhanced Search */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-blue-900 mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  Manage student behavior records, track class progress, and monitor your shadow children.
                </p>
              </div>
              <div className="w-full lg:w-96">
                <GlobalSearch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Enhanced Mobile Layout */}
        <ResponsiveGrid cols={{ mobile: 2, tablet: 2, desktop: 5 }} gap="md">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-20 lg:h-24 flex-col gap-2 bg-red-600 hover:bg-red-700 text-white">
                <AlertTriangle className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="text-xs lg:text-sm font-medium">Log Incident</span>
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
              <Button className="h-20 lg:h-24 flex-col gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Award className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="text-xs lg:text-sm font-medium">Award Merit</span>
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
            className="h-20 lg:h-24 flex-col gap-2 border-blue-200 hover:bg-blue-50"
            onClick={() => setActiveTab('shadow')}
          >
            <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-pink-600" />
            <span className="text-xs lg:text-sm font-medium">Shadow Children</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2 border-orange-200 hover:bg-orange-50"
            onClick={() => setActiveTab('alerts')}
          >
            <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
            <span className="text-xs lg:text-sm font-medium">Shadow Alerts</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2 border-purple-200 hover:bg-purple-50"
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
            <span className="text-xs lg:text-sm font-medium">Analytics</span>
          </Button>
        </ResponsiveGrid>

        {/* Enhanced Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-6 w-full min-w-max lg:min-w-0 bg-white border">
              <TabsTrigger value="overview" className="text-xs lg:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="shadow" className="text-xs lg:text-sm data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
                Shadow Children
              </TabsTrigger>
              <TabsTrigger value="alerts" className="text-xs lg:text-sm data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                Shadow Alerts
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs lg:text-sm data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-xs lg:text-sm data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                Recent Activity
              </TabsTrigger>
              <TabsTrigger value="trends" className="text-xs lg:text-sm data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                Trends
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Class Analytics Overview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-semibold text-blue-900">Class Analytics Overview</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('analytics')}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  View Detailed Analytics
                </Button>
              </div>
              <AnalyticsOverview />
            </section>

            {/* Class Average Heat Score */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <TrendingUp className="h-5 w-5" />
                    Class Average Heat Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HeatBar 
                    score={6.2} 
                    previousScore={6.8} 
                    showTrend={true}
                    size="lg"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Lower scores indicate better behavior. Your class average is in the "Warning" zone.
                  </p>
                  <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">12</div>
                      <div className="text-xs text-green-600">Excellent (0-3)</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">8</div>
                      <div className="text-xs text-blue-600">Good (4-5)</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">5</div>
                      <div className="text-xs text-yellow-600">Warning (6-7)</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">3</div>
                      <div className="text-xs text-red-600">Critical (8+)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="shadow" className="space-y-6 mt-6">
            <ShadowParentSection />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6 mt-6">
            <ShadowAlertsSection />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="recent" className="space-y-6 mt-6">
            <RecentActivityCard />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6 mt-6">
            <section>
              <h2 className="text-lg lg:text-xl font-semibold text-blue-900 mb-4">Behavior Trends</h2>
              <ResponsiveGrid cols={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
                <BehaviorChart 
                  type="bar" 
                  title="Monthly Incidents vs Merits"
                />
                <BehaviorChart 
                  type="line" 
                  title="Heat Score Trend"
                />
              </ResponsiveGrid>
            </section>
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </div>
  );
};

export default TeacherDashboard;
