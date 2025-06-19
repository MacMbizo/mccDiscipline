import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { useStudents } from '@/hooks/useStudents';
import { 
  Users, 
  Award, 
  AlertTriangle, 
  Calendar, 
  TrendingUp,
  Download,
  MessageSquare,
  Bell,
  Home,
  School
} from 'lucide-react';
import DashboardHeader from './DashboardHeader';
import HeatBar from '@/components/common/HeatBar';
import BehaviorChart from '@/components/analytics/BehaviorChart';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { format } from 'date-fns';

const ParentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // In a real app, this would be fetched based on parent-child relationships
  const { data: students = [] } = useStudents();
  const parentChildren = students.slice(0, 2); // Mock: first 2 students as children
  
  const currentChild = selectedChild ? students.find(s => s.id === selectedChild) : parentChildren[0];
  const { data: behaviorRecords = [] } = useBehaviorRecords(currentChild?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const incidents = behaviorRecords.filter(r => r.type === 'incident');
  const merits = behaviorRecords.filter(r => r.type === 'merit');
  const totalMeritPoints = merits.reduce((sum, merit) => sum + (merit.points || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Parent Dashboard"
        userName={user.name}
        onLogout={logout}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Section with Child Selector */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900 mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600">
                Monitor your child's behavior progress and school activities.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="min-w-48">
                <Select 
                  value={selectedChild || parentChildren[0]?.id} 
                  onValueChange={setSelectedChild}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentChildren.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {child.name} - {child.grade}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {currentChild && (
          <>
            {/* Child Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentChild.grade}</div>
                  <div className="text-sm text-gray-600">Grade Level</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {currentChild.boarding_status === 'boarder' ? (
                      <Home className="h-4 w-4 text-blue-600" />
                    ) : (
                      <School className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {currentChild.boarding_status === 'boarder' ? 'Boarder' : 'Day Scholar'}
                  </div>
                  <div className="text-xs text-gray-600">Student Type</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{totalMeritPoints}</div>
                  <div className="text-sm text-gray-600">Merit Points</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{incidents.length}</div>
                  <div className="text-sm text-gray-600">Incidents</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {(currentChild.behavior_score || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Heat Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Counseling Alert */}
            {currentChild.needs_counseling && (
              <Card className="border-orange-300 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-orange-800">Counseling Recommended</div>
                      <p className="text-sm text-orange-700 mt-1">
                        {currentChild.counseling_reason || 'Your child has been flagged for counseling support.'}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                          Contact School Counselor
                        </Button>
                        <Button size="sm" variant="outline">
                          Schedule Meeting
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Heat Score Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {currentChild.name}'s Behavior Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HeatBar 
                  score={currentChild.behavior_score || 0} 
                  showTrend={true}
                  size="lg"
                />
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Current Status:</strong> {' '}
                    {currentChild.behavior_score <= 3 ? 'Excellent behavior - Keep up the great work!' : 
                     currentChild.behavior_score <= 5 ? 'Good behavior with room for improvement' :
                     currentChild.behavior_score <= 7 ? 'Warning zone - Please discuss behavior with your child' : 
                     'Critical - Immediate attention required'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tabbed Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="incidents">Incidents</TabsTrigger>
                <TabsTrigger value="merits">Merits</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {behaviorRecords.slice(0, 5).map((record) => (
                          <div key={record.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            {record.type === 'merit' ? (
                              <Award className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">
                                {record.type === 'merit' ? 'Merit Award' : 'Incident Report'}
                              </div>
                              <div className="text-sm text-gray-600">{record.description}</div>
                              <div className="text-xs text-gray-500">
                                {format(new Date(record.timestamp!), 'MMM dd, yyyy')}
                              </div>
                            </div>
                            {record.type === 'merit' && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                +{record.points} pts
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {record.location}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>This Month's Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="text-green-800">Merit Points Earned</span>
                          <span className="font-bold text-green-800">+{totalMeritPoints}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="text-red-800">Incidents Reported</span>
                          <span className="font-bold text-red-800">{incidents.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-800">Overall Trend</span>
                          <span className="font-bold text-blue-800">
                            {totalMeritPoints > incidents.length ? 'Improving' : 'Needs Attention'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Behavior Trends Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Behavior Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BehaviorChart type="line" title="Monthly Progress" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="incidents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Incident Reports
                      </span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {incidents.map((incident) => (
                        <div key={incident.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium text-red-800">
                              {incident.misdemeanor?.name}
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary">
                                {incident.offense_number}
                                {incident.offense_number === 1 ? 'st' : 
                                 incident.offense_number === 2 ? 'nd' : 
                                 incident.offense_number === 3 ? 'rd' : 'th'} Offense
                              </Badge>
                              <Badge variant="outline">{incident.location}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>{format(new Date(incident.timestamp!), 'MMM dd, yyyy')}</span>
                          </div>
                          {incident.sanction && (
                            <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-400">
                              <p className="text-sm text-orange-800">
                                <strong>Sanction Applied:</strong> {incident.sanction}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="merits" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-green-600" />
                        Merit Awards
                      </span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 grid grid-cols-5 gap-2">
                      {['Bronze', 'Silver', 'Gold', 'Diamond', 'Platinum'].map((tier) => {
                        const tierCount = merits.filter(m => m.merit_tier === tier).length;
                        return (
                          <div key={tier} className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold">{tierCount}</div>
                            <div className="text-xs text-gray-600">{tier}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="space-y-3">
                      {merits.map((merit) => (
                        <div key={merit.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium text-green-800">
                              {merit.merit_tier} Merit Award
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                +{merit.points} points
                              </Badge>
                              <Badge variant="outline">{merit.location}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{merit.description}</p>
                          <div className="text-xs text-gray-500">
                            {format(new Date(merit.timestamp!), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      ))}
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
                        Schedule Parent-Teacher Meeting
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <Bell className="h-6 w-6" />
                        View School Announcements
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <NotificationSettings />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
