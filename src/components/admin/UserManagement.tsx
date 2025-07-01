
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'shadow_parent' | 'counselor';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  profileImage?: string;
  phone?: string;
  address?: string;
}

interface NewUserForm {
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  sendWelcomeEmail: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@mcc.edu',
      role: 'admin',
      isActive: true,
      lastLogin: new Date('2023-09-15T10:30:00'),
      createdAt: new Date('2023-01-15T00:00:00'),
      phone: '+263 777 123 456',
      address: 'Gweru, Zimbabwe'
    },
    {
      id: '2',
      name: 'Sarah Teacher',
      email: 'sarah.teacher@mcc.edu',
      role: 'teacher',
      isActive: true,
      lastLogin: new Date('2023-09-14T14:20:00'),
      createdAt: new Date('2023-02-01T00:00:00'),
      phone: '+263 777 234 567'
    },
    {
      id: '3',
      name: 'Mike Student',
      email: 'mike.student@mcc.edu',
      role: 'student',
      isActive: false,
      createdAt: new Date('2023-03-01T00:00:00')
    }
  ]);

  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: '',
    email: '',
    role: '',
    phone: '',
    address: '',
    sendWelcomeEmail: true
  });

  const { toast } = useToast();

  const createUser = async () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate email
    if (users.some(user => user.email === newUserForm.email)) {
      toast({
        title: "Email Already Exists",
        description: "A user with this email already exists",
        variant: "destructive"
      });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role as User['role'],
      isActive: true,
      createdAt: new Date(),
      phone: newUserForm.phone || undefined,
      address: newUserForm.address || undefined
    };

    setUsers(prev => [newUser, ...prev]);
    setCreateUserDialog(false);
    setNewUserForm({
      name: '',
      email: '',
      role: '',
      phone: '',
      address: '',
      sendWelcomeEmail: true
    });

    toast({
      title: "User Created",
      description: `${newUser.name} has been created successfully${newUserForm.sendWelcomeEmail ? ' and welcome email sent' : ''}`,
    });
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setEditUserDialog(false);
    setSelectedUser(null);

    toast({
      title: "User Updated",
      description: `${updatedUser.name}'s profile has been updated`,
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: user?.isActive ? "User Deactivated" : "User Activated",
      description: `${user?.name} has been ${user?.isActive ? 'deactivated' : 'activated'}`,
    });
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the system`,
      variant: "destructive"
    });
  };

  const sendPasswordReset = (userId: string) => {
    const user = users.find(u => u.id === userId);
    toast({
      title: "Password Reset Sent",
      description: `Password reset email sent to ${user?.email}`,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'teacher': return 'default';
      case 'counselor': return 'secondary';
      case 'parent': return 'outline';
      case 'shadow_parent': return 'outline';
      case 'student': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'teacher': return <Users className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create User Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Create and manage user accounts and profiles</p>
        </div>
        
        <Dialog open={createUserDialog} onOpenChange={setCreateUserDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Role *</Label>
                  <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="counselor">Counselor</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="shadow_parent">Shadow Parent</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="Enter phone number"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Address</Label>
                <Input
                  placeholder="Enter address"
                  value={newUserForm.address}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendWelcomeEmail"
                  checked={newUserForm.sendWelcomeEmail}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, sendWelcomeEmail: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="sendWelcomeEmail">Send welcome email with login instructions</Label>
              </div>
              
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  A temporary password will be generated and sent to the user's email address.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setCreateUserDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createUser}>
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="counselor">Counselors</SelectItem>
                <SelectItem value="parent">Parents</SelectItem>
                <SelectItem value="shadow_parent">Shadow Parents</SelectItem>
                <SelectItem value="student">Students</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge variant={getRoleColor(user.role) as any} className="flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          {user.role.replace('_', ' ')}
                        </Badge>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1 mt-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                        
                        {user.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.address}
                          </span>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created: {user.createdAt.toLocaleDateString()}
                          </span>
                          {user.lastLogin && (
                            <span>Last login: {user.lastLogin.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditUserDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendPasswordReset(user.id)}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <Select 
                      value={selectedUser.role} 
                      onValueChange={(value) => setSelectedUser(prev => prev ? { ...prev, role: value as User['role'] } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="counselor">Counselor</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="shadow_parent">Shadow Parent</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={selectedUser.phone || ''}
                      onChange={(e) => setSelectedUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Address</Label>
                  <Input
                    value={selectedUser.address || ''}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, address: e.target.value } : null)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Password Reset Email
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Force Password Change on Next Login
                  </Button>
                  
                  <Button 
                    variant={selectedUser.isActive ? "destructive" : "default"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedUser(prev => prev ? { ...prev, isActive: !prev.isActive } : null)}
                  >
                    {selectedUser.isActive ? <UserX className="h-4 w-4 mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                    {selectedUser.isActive ? 'Deactivate Account' : 'Activate Account'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedUser && updateUser(selectedUser)}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
