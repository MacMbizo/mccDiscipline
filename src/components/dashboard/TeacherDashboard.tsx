
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
import { TrendingUp, Users, FileText, Plus, Award, AlertTriangle } from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import QuickActionCards from './QuickActionCards';
import RecentActivityCard from './RecentActivityCard';
import HeatBar from '@/components/common/HeatBar';
import AnalyticsOverview from '@/components/analytics/AnalyticsOverview';
import BehaviorChart from '@/components/analytics/BehaviorChart';
import IncidentForm from '@/components/forms/IncidentForm';
import MeritForm from '@/components/forms/MeritForm';
import GlobalSearch from '@/components/common/GlobalSearch';

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

      <div className="p-4 lg:p-6 space-y-6 max-w-full">
        {/* Welcome Section with Search */}
        <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-blue-900 mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Manage student behavior records and track class progress.
              </p>
            </div>
            <div className="w-full lg:w-96">
              <GlobalSearch />
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-20 lg:h-24 flex-col gap-2 bg-red-600 hover:bg-red-700">
                <AlertTriangle className="h-5 w-5 lg:h-6 lg:w-6" />
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
              <Button className="h-20 lg:h-24 flex-col gap-2 bg-green-600 hover:bg-green-700">
                <Award className="h-5 w-5 lg:h-6 lg:w-6" />
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
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
            <span className="text-xs lg:text-sm">View Analytics</span>
          </Button>

          <Button 
            variant="outline" 
            className="h-20 lg:h-24 flex-col gap-2"
            onClick={() => setActiveTab('recent')}
          >
            <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
            <span className="text-xs lg:text-sm">Recent Records</span>
          </Button>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-4 w-full min-w-max lg:min-w-0">
              <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs lg:text-sm">Analytics</TabsTrigger>
              <TabsTrigger value="recent" className="text-xs lg:text-sm">Recent Activity</TabsTrigger>
              <TabsTrigger value="trends" className="text-xs lg:text-sm">Trends</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Overview */}
            <section>
              <h2 className="text-lg lg:text-xl font-semibold text-blue-900 mb-4">Class Analytics Overview</h2>
              <AnalyticsOverview />
            </section>

            {/* Heat Bar Example */}
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
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <RecentActivityCard />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Behavior Trends Chart */}
            <section>
              <h2 className="text-lg lg:text-xl font-semibold text-blue-900 mb-4">Behavior Trends</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BehaviorChart 
                  type="bar" 
                  title="Monthly Incidents vs Merits"
                />
                <BehaviorChart 
                  type="line" 
                  title="Heat Score Trend"
                />
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
