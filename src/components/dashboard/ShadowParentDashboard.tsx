
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useShadowParentDashboard } from '@/hooks/useShadowParents';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { 
  Users, 
  Award, 
  AlertTriangle, 
  Heart,
  TrendingUp,
  Calendar,
  MessageSquare
} from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import HeatBar from '@/components/common/HeatBar';
import { format } from 'date-fns';

const ShadowParentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: shadowChildren = [] } = useShadowParentDashboard(user?.id || '');
  const { data: allBehaviorRecords = [] } = useBehaviorRecords();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading your shadow parent dashboard...</p>
        </div>
      </div>
    );
  }

  // Filter behavior records for shadow children
  const shadowChildrenIds = shadowChildren.map(child => child.student_id);
  const shadowChildrenRecords = allBehaviorRecords.filter(record => 
    shadowChildrenIds.includes(record.student_id)
  );

  const totalIncidents = shadowChildrenRecords.filter(r => r.type === 'incident').length;
  const totalMerits = shadowChildrenRecords.filter(r => r.type === 'merit').length;
  const totalMeritPoints = shadowChildrenRecords
    .filter(r => r.type === 'merit')
    .reduce((sum, merit) => sum + (merit.points || 0), 0);
  const childrenNeedingCounseling = shadowChildren.filter(child => child.needs_counseling).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Shadow Parent Dashboard"
        userName={user.name}
        onLogout={logout}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-pink-600" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                Welcome, Shadow Parent {user.name}!
              </h1>
              <p className="text-gray-600">
                Caring for {shadowChildren.length} shadow {shadowChildren.length === 1 ? 'child' : 'children'}
              </p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{shadowChildren.length}</div>
              <div className="text-sm text-gray-600">Shadow Children</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{totalMeritPoints}</div>
              <div className="text-sm text-gray-600">Total Merit Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{totalIncidents}</div>
              <div className="text-sm text-gray-600">Recent Incidents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{childrenNeedingCounseling}</div>
              <div className="text-sm text-gray-600">Need Counseling</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="children" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="children">My Shadow Children</TabsTrigger>
            <TabsTrigger value="alerts">Counseling Alerts</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="children" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shadowChildren.map((child) => {
                const childRecords = shadowChildrenRecords.filter(r => r.student_id === child.student_id);
                const recentIncidents = childRecords.filter(r => r.type === 'incident').slice(0, 3);
                const recentMerits = childRecords.filter(r => r.type === 'merit').slice(0, 3);

                return (
                  <Card key={child.student_id} className={child.needs_counseling ? 'border-orange-300 bg-orange-50' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          {child.student_name}
                        </span>
                        <div className="flex gap-2">
                          <Badge variant="outline">{child.grade}</Badge>
                          <Badge variant="outline">{child.boarding_status}</Badge>
                          {child.needs_counseling && (
                            <Badge variant="destructive">Needs Counseling</Badge>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Heat Score */}
                      <div>
                        <h4 className="font-medium mb-2">Behavior Score</h4>
                        <HeatBar 
                          score={child.behavior_score || 0} 
                          showTrend={true}
                          size="sm"
                        />
                      </div>

                      {/* Recent Activity Summary */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-600">{child.recent_incidents}</div>
                          <div className="text-xs text-red-600">Recent Incidents</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{child.recent_merits}</div>
                          <div className="text-xs text-green-600">Recent Merits</div>
                        </div>
                      </div>

                      {/* Recent Records */}
                      {(recentIncidents.length > 0 || recentMerits.length > 0) && (
                        <div>
                          <h4 className="font-medium mb-2">Recent Activity</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {[...recentIncidents, ...recentMerits]
                              .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
                              .slice(0, 3)
                              .map((record) => (
                                <div key={record.id} className="flex items-center gap-2 text-sm p-2 border rounded">
                                  {record.type === 'merit' ? (
                                    <Award className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {record.type === 'merit' ? `${record.merit_tier} Merit` : 'Incident'}
                                    </div>
                                    <div className="text-gray-600 truncate">{record.description}</div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {format(new Date(record.timestamp!), 'MMM dd')}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Student
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {shadowChildren.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Shadow Children Assigned</h3>
                  <p className="text-gray-500">
                    You haven't been assigned any shadow children yet. Contact the administration 
                    for assignment details.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Counseling Alerts for Shadow Children
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shadowChildren.filter(child => child.needs_counseling).map((child) => (
                    <div key={child.student_id} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-orange-800">{child.student_name}</div>
                        <Badge variant="destructive">Needs Attention</Badge>
                      </div>
                      <p className="text-sm text-orange-700 mb-3">
                        Current behavior score: {(child.behavior_score || 0).toFixed(1)} - 
                        Please schedule a counseling session or meeting.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Schedule Counseling
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Counselor
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {shadowChildren.filter(child => child.needs_counseling).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">All Clear!</h3>
                      <p>None of your shadow children currently need counseling intervention.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <MessageSquare className="h-6 w-6" />
                    Message All Shadow Children
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    Schedule Group Meeting
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Users className="h-6 w-6" />
                    Contact Parents
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Report Concerns
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShadowParentDashboard;
