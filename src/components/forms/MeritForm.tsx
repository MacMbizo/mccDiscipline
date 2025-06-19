
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStudents } from '@/hooks/useStudents';
import { useCreateBehaviorRecord } from '@/hooks/useBehaviorRecords';
import { useAuth } from '@/contexts/AuthContext';
import { Award, User, Star } from 'lucide-react';

interface MeritFormData {
  student_id: string;
  merit_tier: string;
  points: number;
  description: string;
}

const meritTiers = [
  { name: 'Bronze', points: 1, color: 'bg-orange-100 text-orange-800' },
  { name: 'Silver', points: 2, color: 'bg-gray-100 text-gray-800' },
  { name: 'Gold', points: 3, color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Diamond', points: 3.5, color: 'bg-blue-100 text-blue-800' },
  { name: 'Platinum', points: 4, color: 'bg-purple-100 text-purple-800' },
];

const MeritForm: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MeritFormData>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: students = [] } = useStudents();
  const createRecord = useCreateBehaviorRecord();

  const selectedTierData = meritTiers.find(tier => tier.name === selectedTier);

  const onSubmit = async (data: MeritFormData) => {
    if (!user) return;

    try {
      await createRecord.mutateAsync({
        student_id: data.student_id,
        type: 'merit',
        merit_tier: data.merit_tier,
        points: data.points,
        description: data.description,
        reported_by: user.id,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Merit Awarded",
        description: `${data.points} merit points awarded to the student.`,
      });

      reset();
      setSelectedStudent('');
      setSelectedTier('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to award merit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <Award className="h-5 w-5" />
          Award Merit Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select 
              value={selectedStudent} 
              onValueChange={(value) => {
                setSelectedStudent(value);
                setValue('student_id', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {student.name} - {student.grade}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.student_id && (
              <p className="text-sm text-red-600">Please select a student</p>
            )}
          </div>

          {/* Merit Tier Selection */}
          <div className="space-y-2">
            <Label htmlFor="merit_tier">Merit Tier</Label>
            <Select 
              value={selectedTier}
              onValueChange={(value) => {
                setSelectedTier(value);
                setValue('merit_tier', value);
                const tier = meritTiers.find(t => t.name === value);
                if (tier) setValue('points', tier.points);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select merit tier" />
              </SelectTrigger>
              <SelectContent>
                {meritTiers.map((tier) => (
                  <SelectItem key={tier.name} value={tier.name}>
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4" />
                      <span className="font-medium">{tier.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${tier.color}`}>
                        {tier.points} points
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Points Display */}
          {selectedTierData && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  {selectedTierData.points} merit points will be awarded
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Reason for Merit Award</Label>
            <Textarea
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe the positive behavior or achievement"
              className="min-h-24"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Common Merit Reasons */}
          <div className="space-y-2">
            <Label>Quick Reasons</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Excellent Academic Performance',
                'Outstanding Behavior',
                'Helping Other Students',
                'Community Service',
                'Leadership Excellence',
                'Perfect Attendance',
              ].map((reason) => (
                <Button
                  key={reason}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('description', reason)}
                  className="text-left justify-start h-auto p-2"
                >
                  {reason}
                </Button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={createRecord.isPending}
            >
              {createRecord.isPending ? 'Awarding...' : 'Award Merit'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                setSelectedStudent('');
                setSelectedTier('');
              }}
            >
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MeritForm;
