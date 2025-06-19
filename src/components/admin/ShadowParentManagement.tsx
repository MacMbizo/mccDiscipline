
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStudents } from '@/hooks/useStudents';
import { useShadowParentAssignments, useCreateShadowParentAssignment, useRemoveShadowParentAssignment } from '@/hooks/useShadowParents';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Heart, 
  Plus, 
  Trash2,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const ShadowParentManagement: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedShadowParent, setSelectedShadowParent] = useState<string>('');

  const { data: students = [] } = useStudents();
  const { data: assignments = [] } = useShadowParentAssignments();
  const createAssignment = useCreateShadowParentAssignment();
  const removeAssignment = useRemoveShadowParentAssignment();

  // Get shadow parents from profiles
  const { data: shadowParents = [] } = useQuery({
    queryKey: ['shadow_parents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'shadow_parent')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const handleCreateAssignment = async () => {
    if (!selectedStudent || !selectedShadowParent) {
      toast.error('Please select both a student and shadow parent');
      return;
    }

    try {
      await createAssignment.mutateAsync({
        student_id: selectedStudent,
        shadow_parent_id: selectedShadowParent,
      });
      toast.success('Shadow parent assigned successfully');
      setSelectedStudent('');
      setSelectedShadowParent('');
    } catch (error) {
      toast.error('Failed to assign shadow parent');
      console.error('Error creating assignment:', error);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      await removeAssignment.mutateAsync(assignmentId);
      toast.success('Shadow parent assignment removed');
    } catch (error) {
      toast.error('Failed to remove assignment');
      console.error('Error removing assignment:', error);
    }
  };

  // Get students without shadow parents
  const assignedStudentIds = assignments.map(a => a.student_id);
  const unassignedStudents = students.filter(s => !assignedStudentIds.includes(s.id));

  // Get shadow parent statistics
  const shadowParentStats = shadowParents.map(sp => {
    const assignedCount = assignments.filter(a => a.shadow_parent_id === sp.id).length;
    return { ...sp, assignedCount };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-800">
            <Heart className="h-6 w-6" />
            Shadow Parent Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{assignments.length}</div>
              <div className="text-sm text-gray-600">Active Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{shadowParents.length}</div>
              <div className="text-sm text-gray-600">Shadow Parents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{unassignedStudents.length}</div>
              <div className="text-sm text-gray-600">Unassigned Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {assignments.length > 0 ? (assignments.length / shadowParents.length).toFixed(1) : '0'}
              </div>
              <div className="text-sm text-gray-600">Avg. Children per SP</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create New Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Assign Shadow Parent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {unassignedStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.grade} ({student.gender || 'Unknown'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Shadow Parent</label>
              <Select value={selectedShadowParent} onValueChange={setSelectedShadowParent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a shadow parent" />
                </SelectTrigger>
                <SelectContent>
                  {shadowParentStats.map((sp) => (
                    <SelectItem key={sp.id} value={sp.id}>
                      {sp.name} ({sp.assignedCount}/4 children)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleCreateAssignment}
                disabled={!selectedStudent || !selectedShadowParent || createAssignment.isPending}
                className="w-full"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Assign Shadow Parent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Shadow Parent Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Heart className="h-5 w-5 text-pink-600" />
                  <div>
                    <div className="font-medium">
                      {assignment.student?.name} 
                      <Badge variant="outline" className="ml-2">
                        {assignment.student?.grade}
                      </Badge>
                      <Badge variant="outline" className="ml-1">
                        {assignment.student?.gender}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Shadow Parent: {assignment.shadow_parent?.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">
                    Assigned: {new Date(assignment.assigned_at!).toLocaleDateString()}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveAssignment(assignment.id)}
                    disabled={removeAssignment.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {assignments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Assignments Yet</h3>
              <p>Start by assigning shadow parents to students using the form above.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shadow Parent Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Shadow Parent Load Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shadowParentStats.map((sp) => (
              <div key={sp.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{sp.name}</div>
                  <Badge 
                    variant={sp.assignedCount >= 4 ? "destructive" : sp.assignedCount >= 3 ? "secondary" : "outline"}
                  >
                    {sp.assignedCount}/4
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {sp.assignedCount === 0 ? 'No assigned children' : 
                   sp.assignedCount === 1 ? '1 shadow child' : 
                   `${sp.assignedCount} shadow children`}
                </div>
                {sp.assignedCount >= 4 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    At capacity
                  </div>
                )}
              </div>
            ))}
          </div>

          {shadowParents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Shadow Parents</h3>
              <p>Add users with the 'shadow_parent' role to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShadowParentManagement;
