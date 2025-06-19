
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, GraduationCap, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import HeatBar from '@/components/common/HeatBar';

interface Student {
  id: string;
  student_id: string;
  name: string;
  grade: string;
  behavior_score: number;
  parent_contacts?: any;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

interface StudentFormData {
  student_id: string;
  name: string;
  grade: string;
  parent_contacts?: {
    primary_email?: string;
    secondary_email?: string;
    phone?: string;
  };
}

const StudentManagement: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [formData, setFormData] = useState<StudentFormData>({
    student_id: '',
    name: '',
    grade: '',
    parent_contacts: {
      primary_email: '',
      secondary_email: '',
      phone: ''
    }
  });

  // Fetch students
  const { data: students, isLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Student[];
    },
    enabled: user?.role === 'admin'
  });

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: async (studentData: StudentFormData) => {
      const { data, error } = await supabase
        .from('students')
        .insert({
          student_id: studentData.student_id,
          name: studentData.name,
          grade: studentData.grade,
          parent_contacts: studentData.parent_contacts,
          behavior_score: 0.0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      setIsCreateDialogOpen(false);
      setFormData({ 
        student_id: '', 
        name: '', 
        grade: '', 
        parent_contacts: { primary_email: '', secondary_email: '', phone: '' }
      });
      toast.success('Student created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create student');
    }
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async ({ studentId, studentData }: { studentId: string; studentData: StudentFormData }) => {
      const { error } = await supabase
        .from('students')
        .update({
          student_id: studentData.student_id,
          name: studentData.name,
          grade: studentData.grade,
          parent_contacts: studentData.parent_contacts,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      setIsEditDialogOpen(false);
      setSelectedStudent(null);
      toast.success('Student updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update student');
    }
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast.success('Student deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete student');
    }
  });

  const handleCreateStudent = () => {
    if (!formData.student_id || !formData.name || !formData.grade) {
      toast.error('Please fill in all required fields');
      return;
    }
    createStudentMutation.mutate(formData);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      student_id: student.student_id,
      name: student.name,
      grade: student.grade,
      parent_contacts: student.parent_contacts || { primary_email: '', secondary_email: '', phone: '' }
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = () => {
    if (!selectedStudent || !formData.student_id || !formData.name || !formData.grade) {
      toast.error('Please fill in all required fields');
      return;
    }
    updateStudentMutation.mutate({
      studentId: selectedStudent.id,
      studentData: formData
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student? This will also delete all their behavior records.')) {
      deleteStudentMutation.mutate(studentId);
    }
  };

  // Filter students based on search and grade
  const filteredStudents = students?.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const grades = ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'];

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Student Management
          </h2>
          <p className="text-gray-600">Manage student information and records</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-mcc-blue hover:bg-mcc-blue-dark">
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Create a new student profile in the system.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="student-id">Student ID</Label>
                <Input
                  id="student-id"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  placeholder="e.g., MCC2024001"
                />
              </div>
              
              <div>
                <Label htmlFor="student-name">Full Name</Label>
                <Input
                  id="student-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter student's full name"
                />
              </div>
              
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="primary-email">Primary Parent Email</Label>
                <Input
                  id="primary-email"
                  type="email"
                  value={formData.parent_contacts?.primary_email || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    parent_contacts: { 
                      ...formData.parent_contacts, 
                      primary_email: e.target.value 
                    }
                  })}
                  placeholder="parent@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Parent Phone</Label>
                <Input
                  id="phone"
                  value={formData.parent_contacts?.phone || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    parent_contacts: { 
                      ...formData.parent_contacts, 
                      phone: e.target.value 
                    }
                  })}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateStudent} 
                disabled={createStudentMutation.isPending}
                className="bg-mcc-blue hover:bg-mcc-blue-dark"
              >
                {createStudentMutation.isPending ? 'Creating...' : 'Create Student'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading students...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Heat Score</TableHead>
                  <TableHead>Parent Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents?.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.student_id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>
                      <div className="w-32">
                        <HeatBar score={student.behavior_score || 0} size="sm" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.parent_contacts?.primary_email || 'Not provided'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-student-id">Student ID</Label>
              <Input
                id="edit-student-id"
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                placeholder="e.g., MCC2024001"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-student-name">Full Name</Label>
              <Input
                id="edit-student-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter student's full name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-grade">Grade</Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-primary-email">Primary Parent Email</Label>
              <Input
                id="edit-primary-email"
                type="email"
                value={formData.parent_contacts?.primary_email || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parent_contacts: { 
                    ...formData.parent_contacts, 
                    primary_email: e.target.value 
                  }
                })}
                placeholder="parent@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Parent Phone</Label>
              <Input
                id="edit-phone"
                value={formData.parent_contacts?.phone || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parent_contacts: { 
                    ...formData.parent_contacts, 
                    phone: e.target.value 
                  }
                })}
                placeholder="+1234567890"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStudent} 
              disabled={updateStudentMutation.isPending}
              className="bg-mcc-blue hover:bg-mcc-blue-dark"
            >
              {updateStudentMutation.isPending ? 'Updating...' : 'Update Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagement;
