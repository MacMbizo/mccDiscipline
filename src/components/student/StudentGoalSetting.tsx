
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  Trophy, 
  Calendar, 
  Plus, 
  Check,
  Star,
  TrendingUp
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  type: 'behavior_score' | 'merit_points' | 'incident_reduction' | 'custom';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

interface StudentGoalSettingProps {
  studentId: string;
  currentBehaviorScore: number;
  currentMeritPoints: number;
  className?: string;
}

const StudentGoalSetting: React.FC<StudentGoalSettingProps> = ({
  studentId,
  currentBehaviorScore,
  currentMeritPoints,
  className = ""
}) => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Improve Behavior Score',
      description: 'Reduce my behavior score to below 5.0',
      targetValue: 5.0,
      currentValue: currentBehaviorScore,
      deadline: '2024-01-31',
      type: 'behavior_score',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'Earn Merit Points',
      description: 'Earn 50 merit points this month',
      targetValue: 50,
      currentValue: currentMeritPoints,
      deadline: '2024-01-31',
      type: 'merit_points',
      status: 'active',
      createdAt: '2024-01-01'
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: 0,
    deadline: '',
    type: 'custom' as const
  });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetValue: newGoal.targetValue,
      currentValue: 0,
      deadline: newGoal.deadline,
      type: newGoal.type,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', targetValue: 0, deadline: '', type: 'custom' });
    setShowAddGoal(false);

    toast({
      title: "Goal Created",
      description: "Your new goal has been added successfully!",
    });
  };

  const markGoalComplete = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'completed' as const }
        : goal
    ));

    toast({
      title: "Congratulations!",
      description: "You've completed your goal! Keep up the great work!",
    });
  };

  const getProgressPercentage = (goal: Goal) => {
    if (goal.type === 'behavior_score') {
      // For behavior score, lower is better
      return Math.max(0, Math.min(100, ((goal.targetValue - goal.currentValue) / goal.targetValue) * 100));
    }
    return Math.max(0, Math.min(100, (goal.currentValue / goal.targetValue) * 100));
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'behavior_score': return TrendingUp;
      case 'merit_points': return Star;
      case 'incident_reduction': return Target;
      default: return Trophy;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              My Goals
            </span>
            <Button 
              size="sm" 
              onClick={() => setShowAddGoal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => {
              const IconComponent = getGoalIcon(goal.type);
              const progress = getProgressPercentage(goal);
              const isCompleted = goal.status === 'completed' || progress >= 100;

              return (
                <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Current: {goal.currentValue}</span>
                      <span>Target: {goal.targetValue}</span>
                    </div>
                  </div>

                  {isCompleted && goal.status !== 'completed' && (
                    <Button 
                      size="sm" 
                      onClick={() => markGoalComplete(goal.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add New Goal Form */}
      {showAddGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Enter your goal title"
              />
            </div>

            <div>
              <Label htmlFor="goal-description">Description</Label>
              <Textarea
                id="goal-description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Describe your goal in detail"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal-target">Target Value</Label>
                <Input
                  id="goal-target"
                  type="number"
                  value={newGoal.targetValue || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || 0 })}
                  placeholder="Target number"
                />
              </div>

              <div>
                <Label htmlFor="goal-deadline">Deadline</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddGoal} className="flex-1">
                Create Goal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddGoal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentGoalSetting;
