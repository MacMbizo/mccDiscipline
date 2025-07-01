
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { 
  GraduationCap, 
  Award, 
  AlertTriangle, 
  TrendingUp,
  User,
  Heart,
  RefreshCw
} from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import HeatBar from '@/components/common/HeatBar';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Get student profile with better error handling
  const { data: studentProfile, isLoading: studentLoading, error: studentError, refetch: refetchProfile } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for profile fetch');
        return null;
      }
      
      console.log('Fetching student profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          shadow_parent:profiles!shadow_parent_id(name)
        `)
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching student profile:', error);
        // Don't throw error immediately, return null and let the component handle it
        return null;
      }
      
      console.log('Student profile fetched:', data);
      return data;
    },
    enabled: !!user?.id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get behavior records for this student
  const { data: allBehaviorRecords = [], isLoading: recordsLoading } = useBehaviorRecords();
  
  const studentRecords = allBehaviorRecords.filter(record => 
    record.student_id === user?.id
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading state while fetching data
  if (studentLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader
          title="Student Dashboard"
          userName={user.name}
          onLogout={logout}
        />
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only show error if we've tried to fetch and there's a real error, not just missing data
  if (studentError && !studentProfile) {
    console.error('Student dashboard error:', studentError);
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader
          title="Student Dashboard"
          userName={user.name}
          onLogout={logout}
        />
        <div className="p-6 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Profile Loading Issue</h2>
              <p className="text-gray-600 mb-4">
                There was a temporary issue loading your profile. This might be because your student record hasn't been set up yet.
              </p>
              <div className="space-y-2">
                <Button onClick={() => refetchProfile()} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={logout} className="w-full">
                  Return to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const incidents = studentRecords.filter(r => r.type === 'incident');
  const merits = studentRecords.filter(r => r.type === 'merit');
  const totalMeritPoints = merits.reduce((sum, merit) => sum + (merit.points || 0), 0);

  // Recent records (last 30 days)
  const recentRecords = studentRecords.filter(record => {
    const recordDate = new Date(record.timestamp || record.created_at || '');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return recordDate >= thirtyDaysAgo;
  });

  const recentIncidents = recentRecords.filter(r => r.type === 'incident');
  const recentMerits = recentRecords.filter(r => r.type === 'merit');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Student Dashboard"
        userName={user.name}
        onLogout={logout}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Student Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-blue-900">
                  Welcome back, {studentProfile?.name || user.name}!
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  {studentProfile ? (
                    <>
                      <Badge variant="outline">{studentProfile.grade}</Badge>
                      {studentProfile.gender && (
                        <Badge variant="outline">{studentProfile.gender}</Badge>
                      )}
                      {studentProfile.boarding_status && (
                        <Badge variant="outline">
                          {studentProfile.boarding_status === 'boarder' ? 'Boarder' : 'Day Scholar'}
                        </Badge>
                      )}
                      {studentProfile.shadow_parent && (
                        <div className="flex items-center gap-1 text-sm text-pink-600">
                          <Heart className="h-4 w-4" />
                          Shadow Parent: {studentProfile.shadow_parent.name}
                        </div>
                      )}
                    </>
                  ) : (
                    <Badge variant="secondary">Profile Incomplete</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{totalMeritPoints}</div>
              <div className="text-sm text-gray-600">Total Merit Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{merits.length}</div>
              <div className="text-sm text-gray-600">Total Merits</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{incidents.length}</div>
              <div className="text-sm text-gray-600">Total Incidents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {studentProfile?.behavior_score?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-600">Behavior Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Heat Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Behavior Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HeatBar 
              score={studentProfile?.behavior_score || 0} 
              showTrend={true}
              size="lg"
            />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Understanding Your Score</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 0-3: Excellent behavior - Keep it up!</li>
                <li>• 4-5: Good behavior - You're doing well</li>
                <li>• 6-7: Warning zone - Time to improve</li>
                <li>• 8+: Needs attention - Speak to your teachers or counselor</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for detailed records */}
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="merits">All Merits</TabsTrigger>
            <TabsTrigger value="incidents">All Incidents</TabsTrigger>
          </TabsList>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{recentMerits.length}</div>
                    <div className="text-sm text-green-600">Recent Merits</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{recentIncidents.length}</div>
                    <div className="text-sm text-red-600">Recent Incidents</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {recentRecords
                    .sort((a, b) => new Date(b.timestamp || b.created_at || '').getTime() - new Date(a.timestamp || a.created_at || '').getTime())
                    .slice(0, 10)
                    .map((record) => (
                      <div key={record.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        {record.type === 'merit' ? (
                          <Award className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {record.type === 'merit' ? `${record.merit_tier} Merit` : 'Incident'}
                            </span>
                            {record.type === 'merit' && (
                              <Badge variant="outline" className="text-green-600">
                                +{record.points} pts
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          {record.location && (
                            <p className="text-xs text-gray-500">Location: {record.location}</p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(record.timestamp || record.created_at || ''), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    ))}
                </div>

                {recentRecords.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Recent Activity</h3>
                    <p>You haven't had any merits or incidents in the last 30 days.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merits">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  All Merit Awards ({merits.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {merits
                    .sort((a, b) => new Date(b.timestamp || b.created_at || '').getTime() - new Date(a.timestamp || a.created_at || '').getTime())
                    .map((merit) => (
                      <div key={merit.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Award className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{merit.merit_tier} Merit</span>
                            <Badge variant="outline" className="text-green-600">
                              +{merit.points} pts
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{merit.description}</p>
                          {merit.location && (
                            <p className="text-xs text-gray-500">Location: {merit.location}</p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(merit.timestamp || merit.created_at || ''), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    ))}
                </div>

                {merits.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Merit Awards Yet</h3>
                    <p>Keep up the good work to earn your first merit points!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  All Incidents ({incidents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incidents
                    .sort((a, b) => new Date(b.timestamp || b.created_at || '').getTime() - new Date(a.timestamp || a.created_at || '').getTime())
                    .map((incident) => (
                      <div key={incident.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Incident</span>
                            {incident.offense_number && (
                              <Badge variant="destructive">
                                {incident.offense_number === 1 ? '1st' : 
                                 incident.offense_number === 2 ? '2nd' : 
                                 incident.offense_number === 3 ? '3rd' : 
                                 `${incident.offense_number}th`} Offense
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{incident.description}</p>
                          {incident.sanction && (
                            <p className="text-xs text-red-600 font-medium">Sanction: {incident.sanction}</p>
                          )}
                          {incident.location && (
                            <p className="text-xs text-gray-500">Location: {incident.location}</p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(incident.timestamp || incident.created_at || ''), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    ))}
                </div>

                {incidents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Incidents Recorded</h3>
                    <p>Excellent! You haven't had any disciplinary incidents.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Counseling Alert */}
        {studentProfile?.needs_counseling && (
          <Card className="border-orange-300 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Counseling Recommended
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-2">
                {studentProfile.counseling_reason || 'You have been flagged for a counseling session.'}
              </p>
              <p className="text-sm text-orange-600">
                Please speak with your teacher, shadow parent, or visit the counseling office.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
