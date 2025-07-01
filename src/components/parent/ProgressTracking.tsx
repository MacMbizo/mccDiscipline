
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  AlertTriangle,
  Calendar,
  BookOpen,
  Users
} from 'lucide-react';

interface ProgressTrackingProps {
  studentId: string;
  studentName: string;
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({ studentId, studentName }) => {
  // Mock data - in a real app, this would come from your backend
  const progressData = {
    behaviorGoals: [
      {
        id: '1',
        title: 'Improve Punctuality',
        description: 'Arrive to class on time consistently',
        progress: 85,
        target: 100,
        status: 'on_track',
        dueDate: '2024-04-01'
      },
      {
        id: '2',
        title: 'Reduce Classroom Disruptions',
        description: 'Maintain focus during lessons',
        progress: 60,
        target: 90,
        status: 'needs_attention',
        dueDate: '2024-03-30'
      }
    ],
    academicGoals: [
      {
        id: '3',
        title: 'Mathematics Improvement',
        description: 'Achieve grade B or higher in mathematics',
        progress: 75,
        target: 85,
        status: 'on_track',
        dueDate: '2024-04-15'
      }
    ],
    monthlyStats: {
      meritPoints: 45,
      incidents: 2,
      attendanceRate: 96,
      behaviorTrend: 'improving'
    },
    recentAchievements: [
      {
        id: '1',
        title: 'Perfect Attendance Week',
        description: 'Attended all classes for a full week',
        date: '2024-03-01',
        type: 'attendance'
      },
      {
        id: '2',
        title: 'Gold Merit Award',
        description: 'Exceptional performance in Science project',
        date: '2024-02-28',
        type: 'merit'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-800';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'at_risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'needs_attention':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'at_risk':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {progressData.monthlyStats.meritPoints}
              </div>
              <div className="text-sm text-green-600">Merit Points</div>
              <div className="text-xs text-gray-500 mt-1">+12 from last month</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {progressData.monthlyStats.attendanceRate}%
              </div>
              <div className="text-sm text-blue-600">Attendance</div>
              <div className="text-xs text-gray-500 mt-1">Excellent!</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {progressData.monthlyStats.incidents}
              </div>
              <div className="text-sm text-red-600">Incidents</div>
              <div className="text-xs text-gray-500 mt-1">-1 from last month</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div className="text-lg font-bold text-purple-600">Good</div>
              </div>
              <div className="text-sm text-purple-600">Overall Trend</div>
              <div className="text-xs text-gray-500 mt-1">Improving</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Behavior Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Behavior Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.behaviorGoals.map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(goal.status)}
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}% of {goal.target}%</span>
                  </div>
                  <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Due: {goal.dueDate}</span>
                    <span>{Math.max(0, goal.target - goal.progress)}% remaining</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Academic Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Academic Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.academicGoals.map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}% of {goal.target}%</span>
                  </div>
                  <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Due: {goal.dueDate}</span>
                    <span>{Math.max(0, goal.target - goal.progress)}% remaining</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressData.recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Award className="h-8 w-8 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-800">{achievement.title}</h4>
                  <p className="text-sm text-green-700">{achievement.description}</p>
                  <p className="text-xs text-green-600">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracking;
