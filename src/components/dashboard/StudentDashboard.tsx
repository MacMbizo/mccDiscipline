
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Heart,
  User,
  Calendar,
  Target,
  BookOpen
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardHeader from './DashboardHeader';
import HeatBar from '@/components/common/HeatBar';
import BehaviorChart from '@/components/analytics/BehaviorChart';
import ResponsiveContainer from '@/components/mobile/ResponsiveContainer';
import ResponsiveGrid from '@/components/mobile/ResponsiveGrid';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Get student's own data including shadow parent info
  const { data: studentData } = useQuery({
    queryKey: ['student_data', user?.name],
    queryFn: async () => {
      if (!user?.name) return null;
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          shadow_parent_assignments!inner(
            shadow_parent:profiles!shadow_parent_id(name, gender)
          )
        `)
        .eq('name', user.name)
        .eq('shadow_parent_assignments.is_active', true)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.name,
  });

  // Get student's behavior records
  const { data: behaviorRecords = [] } = useQuery({
    queryKey: ['student_behavior_records', studentData?.id],
    queryFn: async () => {
      if (!studentData?.id) return [];
      
      const { data, error } = await supabase
        .from('behavior_records')
        .select('*')
        .eq('student_id', studentData.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!studentData?.id,
  });

  const shadowParent = studentData?.shadow_parent_assignments?.[0]?.shadow_parent;
  const shadowParentRelation = shadowParent?.gender === 'male' ? 'Shadow Father' : 
                              shadowParent?.gender === 'female' ? 'Shadow Mother' : 
                              'Shadow Parent';

  const recentIncidents = behaviorRecords.filter(record => record.type === 'incident').length;
  const recentMerits = behaviorRecords.filter(record => record.type === 'merit').length;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Student Dashboard"
        userName={user.name}
        onLogout={logout}
      />

      <ResponsiveContainer className="py-4 lg:py-6 space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-blue-900 mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  Track your behavior progress, view your achievements, and connect with your mentors.
                </p>
              </div>
              {studentData && (
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Your Grade</div>
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                    {studentData.grade}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shadow Parent Card */}
        {shadowParent && (
          <Card className="border-pink-200 bg-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-800">
                <Heart className="h-5 w-5" />
                Your {shadowParentRelation}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-pink-200 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-pink-900">{shadowParent.name}</h3>
                  <p className="text-sm text-pink-700">
                    Your dedicated mentor who cares about your progress and success
                  </p>
                </div>
                <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-100">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <ResponsiveGrid cols={{ mobile: 2, tablet: 4, desktop: 4 }} gap="md">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {studentData?.behavior_score?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-600">Heat Score</div>
              <div className="text-xs text-gray-500 mt-1">
                {(studentData?.behavior_score || 0) <= 3 ? 'Excellent' :
                 (studentData?.behavior_score || 0) <= 5 ? 'Good' :
                 (studentData?.behavior_score || 0) <= 7 ? 'Warning' : 'Critical'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{recentIncidents}</div>
              <div className="text-sm text-gray-600">Recent Incidents</div>
              <div className="text-xs text-gray-500 mt-1">Last 10 records</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{recentMerits}</div>
              <div className="text-sm text-gray-600">Recent Merits</div>
              <div className="text-xs text-gray-500 mt-1">Last 10 records</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {studentData?.boarding_status === 'boarder' ? 'Boarder' : 'Day Scholar'}
              </div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-xs text-gray-500 mt-1">School residence</div>
            </CardContent>
          </Card>
        </ResponsiveGrid>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-4 w-full min-w-max lg:min-w-0 bg-white border">
              <TabsTrigger value="overview" className="text-xs lg:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="behavior" className="text-xs lg:text-sm data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                Behavior
              </TabsTrigger>
              <TabsTrigger value="progress" className="text-xs lg:text-sm data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                Progress
              </TabsTrigger>
              <TabsTrigger value="goals" className="text-xs lg:text-sm data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                Goals
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Heat Bar Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Behavior Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HeatBar 
                  score={studentData?.behavior_score || 0} 
                  size="lg"
                  showTrend={true}
                />
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Your current behavior score is <strong>{studentData?.behavior_score?.toFixed(1) || '0.0'}</strong>.
                    {(studentData?.behavior_score || 0) <= 3 && ' Excellent work! Keep it up!'}
                    {(studentData?.behavior_score || 0) > 3 && (studentData?.behavior_score || 0) <= 5 && ' Good behavior - maintain this positive trend.'}
                    {(studentData?.behavior_score || 0) > 5 && (studentData?.behavior_score || 0) <= 7 && ' Warning zone - focus on improving your behavior.'}
                    {(studentData?.behavior_score || 0) > 7 && ' Critical - immediate improvement needed.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Behavior Summary */}
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="lg">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Recent Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {behaviorRecords.filter(r => r.type === 'incident').length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <div className="text-sm">No recent incidents</div>
                      <div className="text-xs">Great job maintaining good behavior!</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {behaviorRecords
                        .filter(r => r.type === 'incident')
                        .slice(0, 3)
                        .map((record) => (
                          <div key={record.id} className="p-2 bg-red-50 rounded border-l-4 border-red-400">
                            <div className="text-sm font-medium">{record.description}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(record.created_at!).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Award className="h-5 w-5" />
                    Recent Merits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {behaviorRecords.filter(r => r.type === 'merit').length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <div className="text-sm">No recent merits</div>
                      <div className="text-xs">Keep working to earn recognition!</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {behaviorRecords
                        .filter(r => r.type === 'merit')
                        .slice(0, 3)
                        .map((record) => (
                          <div key={record.id} className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                            <div className="text-sm font-medium flex items-center gap-2">
                              {record.description}
                              <Badge variant="outline" className="text-xs">
                                {record.merit_tier}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(record.created_at!).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ResponsiveGrid>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6 mt-6">
            <BehaviorChart 
              type="line" 
              title="Your Behavior Trend Over Time"
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Academic & Behavioral Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Progress Tracking</h3>
                  <p>Your progress reports and achievements will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Personal Goals & Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Goal Setting</h3>
                  <p>Set and track your personal behavior and academic goals here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentDashboard;
