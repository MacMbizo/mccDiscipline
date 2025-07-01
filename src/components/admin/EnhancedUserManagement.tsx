
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
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
  Users, 
  UserPlus, 
  Heart, 
  Search,
  Filter,
  Edit,
  Eye,
  UserCheck,
  GraduationCap,
  Shield
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import TeacherShadowAssignment from '@/components/admin/TeacherShadowAssignment';

const EnhancedUserManagement: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showShadowDialog, setShowShadowDialog] = useState<boolean>(false);

  // Get all users/profiles
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', selectedRole, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (selectedRole !== 'all') {
        query = query.eq('role', selectedRole);
      }

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Get shadow assignment stats for teachers
  const { data: shadowStats = {} } = useQuery({
    queryKey: ['shadow_stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shadow_parent_assignments')
        .select('shadow_parent_id')
        .eq('is_active', true);
      
      if (error) throw error;
      
      // Count assignments per teacher
      const stats: Record<string, number> = {};
      data.forEach(assignment => {
        stats[assignment.shadow_parent_id] = (stats[assignment.shadow_parent_id] || 0) + 1;
      });
      
      return stats;
    },
  });

  const teachers = users.filter(user => user.role === 'teacher');
  const students = users.filter(user => user.role === 'student');
  const admins = users.filter(user => user.role === 'admin');
  const parents = users.filter(user => user.role === 'parent');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'teacher': return <GraduationCap className="h-4 w-4" />;
      case 'student': return <Users className="h-4 w-4" />;
      case 'parent': return <Heart className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const handleViewShadowAssignments = (teacher: any) => {
    setSelectedUser(teacher);
    setShowShadowDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
            <div className="text-sm text-gray-600">Teachers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{students.length}</div>
            <div className="text-sm text-gray-600">Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{admins.length}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{parents.length}</div>
            <div className="text-sm text-gray-600">Parents</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="parent">Parents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Management Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="shadow">Shadow Assignments</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {user.name}
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                          {user.gender && (
                            <Badge variant="outline" className="text-xs">
                              {user.gender}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Joined: {new Date(user.created_at!).toLocaleDateString()}
                          {user.last_login && (
                            <span> • Last login: {new Date(user.last_login).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.role === 'teacher' && (
                        <div className="text-sm text-gray-500">
                          Shadow Children: {shadowStats[user.id] || 0}/5
                        </div>
                      )}
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Teachers ({teachers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {teacher.name}
                          {teacher.gender && (
                            <Badge variant="outline" className="text-xs">
                              {teacher.gender}
                            </Badge>
                          )}
                          <Badge className="bg-blue-100 text-blue-800">
                            Teacher
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          Shadow Children: {shadowStats[teacher.id] || 0}/5
                          {(shadowStats[teacher.id] || 0) >= 5 && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              At Capacity
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewShadowAssignments(teacher)}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Shadow Group
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shadow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Shadow Parent Assignments Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((teacher) => {
                  const assignmentCount = shadowStats[teacher.id] || 0;
                  const capacityPercentage = (assignmentCount / 5) * 100;
                  
                  return (
                    <div key={teacher.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">{teacher.name}</div>
                        <Badge 
                          variant={assignmentCount >= 5 ? "destructive" : assignmentCount >= 3 ? "secondary" : "outline"}
                        >
                          {assignmentCount}/5
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          {teacher.gender === 'male' ? 'Shadow Sons' : 
                           teacher.gender === 'female' ? 'Shadow Daughters' : 
                           'Shadow Children'}: {assignmentCount}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              capacityPercentage >= 100 ? 'bg-red-500' : 
                              capacityPercentage >= 60 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${capacityPercentage}%` }}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleViewShadowAssignments(teacher)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                User Management Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Import Users
                </Button>
                <Button className="w-full" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Shadow Assignment Dialog */}
      <Dialog open={showShadowDialog} onOpenChange={setShowShadowDialog}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Shadow Assignment Management - {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <TeacherShadowAssignment
              teacherId={selectedUser.id}
              teacherName={selectedUser.name}
              teacherGender={selectedUser.gender}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedUserManagement;
