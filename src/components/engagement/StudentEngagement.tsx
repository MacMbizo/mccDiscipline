import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudents } from '@/hooks/useStudents';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import RewardRedemption from './RewardRedemption';
import { 
  Trophy, 
  Target, 
  Star, 
  Award,
  TrendingUp,
  Calendar,
  Users,
  Sparkles,
  Gift,
  Crown
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'behavior' | 'academic' | 'leadership' | 'community';
  rarity: 'common' | 'rare' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

interface StudentEngagementProps {
  className?: string;
}

const StudentEngagement: React.FC<StudentEngagementProps> = ({ className = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: students = [] } = useStudents();
  const { data: records = [] } = useBehaviorRecords();

  // Sample achievements system
  const achievements: Achievement[] = [
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'No incidents for 7 consecutive days',
      icon: <Trophy className="h-5 w-5 text-yellow-600" />,
      category: 'behavior',
      rarity: 'common',
      progress: 5,
      maxProgress: 7,
      unlocked: false
    },
    {
      id: 'merit-master',
      name: 'Merit Master',
      description: 'Earn 10 merit points in one month',
      icon: <Star className="h-5 w-5 text-blue-600" />,
      category: 'behavior',
      rarity: 'rare',
      progress: 7,
      maxProgress: 10,
      unlocked: false
    },
    {
      id: 'helper',
      name: 'Class Helper',
      description: 'Help 5 different classmates',
      icon: <Users className="h-5 w-5 text-green-600" />,
      category: 'community',
      rarity: 'common',
      progress: 3,
      maxProgress: 5,
      unlocked: false
    },
    {
      id: 'improvement',
      name: 'Improvement Champion',
      description: 'Reduce heat score by 3 points',
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      category: 'behavior',
      rarity: 'rare',
      progress: 2,
      maxProgress: 3,
      unlocked: false
    },
    {
      id: 'leader',
      name: 'Natural Leader',
      description: 'Lead a school project or initiative',
      icon: <Crown className="h-5 w-5 text-orange-600" />,
      category: 'leadership',
      rarity: 'legendary',
      progress: 0,
      maxProgress: 1,
      unlocked: false
    }
  ];

  // Calculate engagement metrics
  const engagementMetrics = React.useMemo(() => {
    const merits = records.filter(r => r.type === 'merit');
    const incidents = records.filter(r => r.type === 'incident');
    
    return {
      totalMeritsAwarded: merits.length,
      studentsWithMerits: new Set(merits.map(m => m.student_id)).size,
      averageGoalCompletion: 68,
      activeGoals: 24,
      achievementsUnlocked: 156,
      weeklyStreaks: students.filter(s => (s.behavior_score || 0) < 3).length
    };
  }, [records, students]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-orange-400 bg-orange-50';
      case 'rare': return 'border-purple-400 bg-purple-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'behavior': return <Target className="h-4 w-4" />;
      case 'academic': return <Award className="h-4 w-4" />;
      case 'leadership': return <Crown className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  // Calculate leaderboard with actual data
  const leaderboard = React.useMemo(() => {
    return students.map(student => {
      const studentMerits = records.filter(r => r.student_id === student.id && r.type === 'merit');
      const totalPoints = studentMerits.reduce((sum, merit) => sum + (merit.points || 0), 0);
      
      return {
        ...student,
        totalPoints,
        monthlyPoints: studentMerits
          .filter(m => new Date(m.created_at || '') > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          .reduce((sum, merit) => sum + (merit.points || 0), 0)
      };
    })
    .sort((a, b) => b.monthlyPoints - a.monthlyPoints)
    .slice(0, 10);
  }, [students, records]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Student Engagement</h2>
          <p className="text-gray-600">Motivate positive behavior through gamification</p>
        </div>
      </div>

      {/* Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{engagementMetrics.totalMeritsAwarded}</p>
              <p className="text-xs text-gray-600">Total Merits</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{engagementMetrics.studentsWithMerits}</p>
              <p className="text-xs text-gray-600">Active Students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{engagementMetrics.averageGoalCompletion}%</p>
              <p className="text-xs text-gray-600">Goal Completion</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{engagementMetrics.activeGoals}</p>
              <p className="text-xs text-gray-600">Active Goals</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="p-2 bg-yellow-100 rounded-lg w-fit mx-auto mb-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{engagementMetrics.achievementsUnlocked}</p>
              <p className="text-xs text-gray-600">Achievements</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="p-2 bg-teal-100 rounded-lg w-fit mx-auto mb-2">
                <Sparkles className="h-5 w-5 text-teal-600" />
              </div>
              <p className="text-2xl font-bold text-teal-600">{engagementMetrics.weeklyStreaks}</p>
              <p className="text-xs text-gray-600">Good Streaks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievement System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 border-2 rounded-lg ${getRarityColor(achievement.rarity)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(achievement.category)}
                            <span className="ml-1">{achievement.category}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((student, index) => (
                  <div key={student.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.grade}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{student.monthlyPoints} pts</p>
                      <p className="text-sm text-gray-600">This month</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <RewardRedemption />
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Perfect Week Challenge',
                    description: 'Go 7 days without any incidents',
                    participants: 45,
                    timeLeft: '3 days',
                    reward: '100 merit points'
                  },
                  {
                    name: 'Helping Hands',
                    description: 'Help 3 classmates this week',
                    participants: 32,
                    timeLeft: '5 days',
                    reward: 'Special badge'
                  },
                  {
                    name: 'Class Unity',
                    description: 'Entire class achieves positive week',
                    participants: 28,
                    timeLeft: '2 days',
                    reward: 'Pizza party'
                  }
                ].map((challenge, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{challenge.name}</h3>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      <Badge variant="outline">{challenge.timeLeft} left</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {challenge.participants} participants
                      </span>
                      <span className="text-sm font-medium text-purple-600">
                        Reward: {challenge.reward}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentEngagement;
