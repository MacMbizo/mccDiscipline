
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Users, 
  Plus, 
  Trash2,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Brain,
  Filter,
  Search,
  Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreateShadowParentAssignment, useRemoveShadowParentAssignment } from '@/hooks/useShadowParents';
import { toast } from 'sonner';

interface TeacherShadowAssignmentProps {
  teacherId: string;
  teacherName: string;
  teacherGender?: string;
}

interface AssignmentRecommendation {
  student_id: string;
  student_name: string;
  grade: string;
  behavior_score: number;
  recent_incidents: number;
  recent_merits: number;
  priority_score: number;
  needs_counseling: boolean;
}

const TeacherShadowAssignment: React.FC<TeacherShadowAssignmentProps> = ({
  teacherId,
  teacherName,
  teacherGender
}) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showRecommendations, setShowRecommendations] = useState<boolean>(true);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);

  const createAssignment = useCreateShadowParentAssignment();
  const removeAssignment = useRemoveShadowParentAssignment();

  // Get teacher's current shadow assignments
  const { data: currentAssignments = [] } = useQuery({
    queryKey: ['teacher_shadow_assignments', teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shadow_parent_assignments')
        .select(`
          *,
          student:students(*)
        `)
        .eq('shadow_parent_id', teacherId)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Get teacher's capacity
  const { data: capacity } = useQuery({
    queryKey: ['teacher_shadow_capacity', teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_teacher_shadow_capacity', { teacher_id: teacherId });
      
      if (error) throw error;
      return data[0];
    },
  });

  // Get assignment recommendations
  const { data: recommendations = [] } = useQuery({
    queryKey: ['shadow_assignment_recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_shadow_assignment_recommendations');
      
      if (error) throw error;
      return data as AssignmentRecommendation[];
    },
  });

  // Filter recommendations based on search
  const filteredRecommendations = recommendations.filter(rec =>
    rec.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const relationshipTerm = teacherGender === 'male' ? 'Shadow Sons' : 
                          teacherGender === 'female' ? 'Shadow Daughters' : 
                          'Shadow Children';

  const childTerm = teacherGender === 'male' ? 'son' : 
                   teacherGender === 'female' ? 'daughter' : 
                   'child';

  const handleAssignStudent = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student to assign');
      return;
    }

    if (!capacity?.can_assign_more) {
      toast.error('Teacher has reached maximum capacity of 5 shadow children');
      return;
    }

    try {
      const selectedRec = recommendations.find(r => r.student_id === selectedStudent);
      
      await createAssignment.mutateAsync({
        student_id: selectedStudent,
        shadow_parent_id: teacherId,
        assigned_by: teacherId, // In real app, this would be the current admin user
        assignment_notes: assignmentNotes,
        priority_score: selectedRec?.priority_score || 0,
      });

      toast.success(`Student assigned as shadow ${childTerm} successfully!`);
      setSelectedStudent('');
      setAssignmentNotes('');
      setIsAssignDialogOpen(false);
    } catch (error) {
      toast.error('Failed to assign shadow child');
      console.error('Error assigning shadow child:', error);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string, studentName: string) => {
    try {
      await removeAssignment.mutateAsync(assignmentId);
      toast.success(`${studentName} removed from shadow group`);
    } catch (error) {
      toast.error('Failed to remove shadow child assignment');
      console.error('Error removing assignment:', error);
    }
  };

  const getPriorityBadge = (score: number) => {
    if (score >= 70) return <Badge variant="destructive">High Priority</Badge>;
    if (score >= 40) return <Badge variant="secondary">Medium Priority</Badge>;
    return <Badge variant="outline">Low Priority</Badge>;
  };

  const capacityPercentage = capacity ? (capacity.assigned_count / 5) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Capacity Overview */}
      <Card className="border-pink-200 bg-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <span>{relationshipTerm} - {teacherName}</span>
            </div>
            <Badge variant={capacity?.can_assign_more ? "outline" : "destructive"}>
              {capacity?.assigned_count || 0}/5
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Assignment Capacity</span>
                <span>{capacity?.assigned_count || 0} of 5</span>
              </div>
              <Progress 
                value={capacityPercentage} 
                className={`h-2 ${capacityPercentage >= 100 ? 'bg-red-100' : 'bg-pink-100'}`}
              />
            </div>
            
            {capacity?.remaining_capacity === 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">
                  Teacher has reached maximum capacity
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Shadow Children */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current {relationshipTerm} ({currentAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Shadow Children Assigned
              </h3>
              <p>Assign students to create meaningful mentorship relationships.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentAssignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {assignment.student?.name}
                        <Badge variant="outline" className="ml-2">
                          Shadow {childTerm.charAt(0).toUpperCase() + childTerm.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {assignment.student?.grade} • Heat Score: {assignment.student?.behavior_score?.toFixed(1) || '0.0'}
                      </div>
                      {assignment.assignment_notes && (
                        <div className="text-xs text-gray-500 mt-1">
                          Notes: {assignment.assignment_notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500">
                      Assigned: {new Date(assignment.assigned_at!).toLocaleDateString()}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveAssignment(assignment.id, assignment.student?.name || '')}
                      disabled={removeAssignment.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      {capacity?.can_assign_more && (
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Assign New Shadow {childTerm.charAt(0).toUpperCase() + childTerm.slice(1)}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Assign Shadow {childTerm.charAt(0).toUpperCase() + childTerm.slice(1)} to {teacherName}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Search and Filter Controls */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students by name or grade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  {showRecommendations ? 'Show All' : 'Show Recommendations'}
                </Button>
              </div>

              {/* Student Selection List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredRecommendations
                  .filter(rec => showRecommendations ? rec.priority_score > 20 : true)
                  .map((recommendation) => (
                  <div
                    key={recommendation.student_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedStudent === recommendation.student_id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                    }`}
                    onClick={() => setSelectedStudent(recommendation.student_id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {recommendation.student_name}
                            {recommendation.priority_score > 50 && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {recommendation.grade} • Heat Score: {recommendation.behavior_score?.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Recent: {recommendation.recent_incidents} incidents, {recommendation.recent_merits} merits
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getPriorityBadge(recommendation.priority_score)}
                        {recommendation.needs_counseling && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Needs Counseling
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assignment Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assignment Notes (Optional)
                </label>
                <Textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Add notes about this shadow parent-child assignment..."
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAssignStudent}
                  disabled={!selectedStudent || createAssignment.isPending}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign Shadow {childTerm.charAt(0).toUpperCase() + childTerm.slice(1)}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {filteredRecommendations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Available Students
            </h3>
            <p className="text-gray-500">
              All students have been assigned to shadow parents.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherShadowAssignment;
