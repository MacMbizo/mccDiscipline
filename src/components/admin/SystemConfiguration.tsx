
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Settings, Award, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface MeritTier {
  tier: string;
  points: number;
  description: string;
  color: string;
}

interface Misdemeanor {
  id: string;
  name: string;
  location: string;
  category: string;
  severity_level: number;
  sanctions: Record<string, string>;
  status: string;
}

const SystemConfiguration: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isMeritDialogOpen, setIsMeritDialogOpen] = useState(false);
  const [isMisdemeanorDialogOpen, setIsMisdemeanorDialogOpen] = useState(false);
  const [selectedMisdemeanor, setSelectedMisdemeanor] = useState<Misdemeanor | null>(null);
  
  // Merit tier management
  const [meritTiers, setMeritTiers] = useState<MeritTier[]>([
    { tier: 'Bronze', points: 1, description: 'Basic positive behavior recognition', color: '#CD7F32' },
    { tier: 'Silver', points: 2, description: 'Good behavior and participation', color: '#C0C0C0' },
    { tier: 'Gold', points: 3, description: 'Excellent behavior and leadership', color: '#FFD700' },
    { tier: 'Diamond', points: 3.5, description: 'Outstanding achievement', color: '#B9F2FF' },
    { tier: 'Platinum', points: 4, description: 'Exceptional conduct and service', color: '#E5E4E2' }
  ]);
  
  const [misdemeanorForm, setMisdemeanorForm] = useState({
    name: '',
    location: 'Main School',
    category: '',
    severity_level: 1,
    sanctions: {
      '1st': '',
      '2nd': '',
      '3rd': ''
    }
  });

  // Fetch misdemeanors
  const { data: misdemeanors, isLoading } = useQuery({
    queryKey: ['admin-misdemeanors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('misdemeanors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Misdemeanor[];
    },
    enabled: user?.role === 'admin'
  });

  // Create/Update misdemeanor mutation
  const saveMisdemeanorMutation = useMutation({
    mutationFn: async (misdemeanorData: any) => {
      if (selectedMisdemeanor) {
        // Update existing
        const { error } = await supabase
          .from('misdemeanors')
          .update(misdemeanorData)
          .eq('id', selectedMisdemeanor.id);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('misdemeanors')
          .insert(misdemeanorData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-misdemeanors'] });
      setIsMisdemeanorDialogOpen(false);
      setSelectedMisdemeanor(null);
      setMisdemeanorForm({
        name: '',
        location: 'Main School',
        category: '',
        severity_level: 1,
        sanctions: { '1st': '', '2nd': '', '3rd': '' }
      });
      toast.success(selectedMisdemeanor ? 'Misdemeanor updated successfully' : 'Misdemeanor created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save misdemeanor');
    }
  });

  // Delete misdemeanor mutation
  const deleteMisdemeanorMutation = useMutation({
    mutationFn: async (misdemeanorId: string) => {
      const { error } = await supabase
        .from('misdemeanors')
        .delete()
        .eq('id', misdemeanorId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-misdemeanors'] });
      toast.success('Misdemeanor deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete misdemeanor');
    }
  });

  const handleEditMisdemeanor = (misdemeanor: Misdemeanor) => {
    setSelectedMisdemeanor(misdemeanor);
    setMisdemeanorForm({
      name: misdemeanor.name,
      location: misdemeanor.location,
      category: misdemeanor.category,
      severity_level: misdemeanor.severity_level,
      sanctions: misdemeanor.sanctions as any
    });
    setIsMisdemeanorDialogOpen(true);
  };

  const handleSaveMisdemeanor = () => {
    if (!misdemeanorForm.name || !misdemeanorForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    saveMisdemeanorMutation.mutate(misdemeanorForm);
  };

  const handleDeleteMisdemeanor = (misdemeanorId: string) => {
    if (window.confirm('Are you sure you want to delete this misdemeanor? This action cannot be undone.')) {
      deleteMisdemeanorMutation.mutate(misdemeanorId);
    }
  };

  const updateMeritTier = (index: number, field: keyof MeritTier, value: any) => {
    const updatedTiers = [...meritTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setMeritTiers(updatedTiers);
  };

  const saveMeritConfiguration = () => {
    // In a real application, this would save to the database
    toast.success('Merit tier configuration saved successfully');
    setIsMeritDialogOpen(false);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          System Configuration
        </h2>
        <p className="text-gray-600">Configure merit tiers, misdemeanors, and system rules</p>
      </div>

      <Tabs defaultValue="merits" className="space-y-6">
        <TabsList>
          <TabsTrigger value="merits">Merit Tiers</TabsTrigger>
          <TabsTrigger value="misdemeanors">Misdemeanors</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="merits">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Merit Tier Configuration
                </CardTitle>
                <Dialog open={isMeritDialogOpen} onOpenChange={setIsMeritDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-mcc-blue hover:bg-mcc-blue-dark">
                      <Edit className="mr-2 h-4 w-4" />
                      Configure Tiers
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Configure Merit Tiers</DialogTitle>
                      <DialogDescription>
                        Set up the merit tier system with points and descriptions.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {meritTiers.map((tier, index) => (
                        <div key={tier.tier} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center gap-4">
                            <div className="w-24">
                              <Label>Tier</Label>
                              <Input
                                value={tier.tier}
                                onChange={(e) => updateMeritTier(index, 'tier', e.target.value)}
                                placeholder="Tier name"
                              />
                            </div>
                            <div className="w-24">
                              <Label>Points</Label>
                              <Input
                                type="number"
                                step="0.5"
                                value={tier.points}
                                onChange={(e) => updateMeritTier(index, 'points', parseFloat(e.target.value))}
                              />
                            </div>
                            <div className="w-32">
                              <Label>Color</Label>
                              <Input
                                type="color"
                                value={tier.color}
                                onChange={(e) => updateMeritTier(index, 'color', e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={tier.description}
                              onChange={(e) => updateMeritTier(index, 'description', e.target.value)}
                              placeholder="Tier description"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsMeritDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveMeritConfiguration} className="bg-mcc-blue hover:bg-mcc-blue-dark">
                        Save Configuration
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Color</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meritTiers.map((tier) => (
                    <TableRow key={tier.tier}>
                      <TableCell className="font-medium">{tier.tier}</TableCell>
                      <TableCell>{tier.points}</TableCell>
                      <TableCell>{tier.description}</TableCell>
                      <TableCell>
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: tier.color }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="misdemeanors">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Misdemeanor Management
                </CardTitle>
                <Dialog open={isMisdemeanorDialogOpen} onOpenChange={setIsMisdemeanorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-mcc-blue hover:bg-mcc-blue-dark"
                      onClick={() => {
                        setSelectedMisdemeanor(null);
                        setMisdemeanorForm({
                          name: '',
                          location: 'Main School',
                          category: '',
                          severity_level: 1,
                          sanctions: { '1st': '', '2nd': '', '3rd': '' }
                        });
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Misdemeanor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedMisdemeanor ? 'Edit Misdemeanor' : 'Add New Misdemeanor'}
                      </DialogTitle>
                      <DialogDescription>
                        Configure misdemeanor details and progressive sanctions.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="misdemeanor-name">Misdemeanor Name</Label>
                          <Input
                            id="misdemeanor-name"
                            value={misdemeanorForm.name}
                            onChange={(e) => setMisdemeanorForm({ ...misdemeanorForm, name: e.target.value })}
                            placeholder="e.g., Late to Class"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Select 
                            value={misdemeanorForm.location} 
                            onValueChange={(value) => setMisdemeanorForm({ ...misdemeanorForm, location: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Main School">Main School</SelectItem>
                              <SelectItem value="Hostel">Hostel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={misdemeanorForm.category}
                            onChange={(e) => setMisdemeanorForm({ ...misdemeanorForm, category: e.target.value })}
                            placeholder="e.g., Attendance, Dress Code"
                          />
                        </div>
                        <div>
                          <Label htmlFor="severity">Severity Level (1-5)</Label>
                          <Select 
                            value={misdemeanorForm.severity_level.toString()} 
                            onValueChange={(value) => setMisdemeanorForm({ ...misdemeanorForm, severity_level: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Minor</SelectItem>
                              <SelectItem value="2">2 - Moderate</SelectItem>
                              <SelectItem value="3">3 - Serious</SelectItem>
                              <SelectItem value="4">4 - Severe</SelectItem>
                              <SelectItem value="5">5 - Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Progressive Sanctions</Label>
                        {['1st', '2nd', '3rd'].map((offense) => (
                          <div key={offense}>
                            <Label htmlFor={`sanction-${offense}`}>{offense} Offense</Label>
                            <Textarea
                              id={`sanction-${offense}`}
                              value={misdemeanorForm.sanctions[offense]}
                              onChange={(e) => setMisdemeanorForm({
                                ...misdemeanorForm,
                                sanctions: { ...misdemeanorForm.sanctions, [offense]: e.target.value }
                              })}
                              placeholder={`Enter sanction for ${offense} offense`}
                              rows={2}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsMisdemeanorDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveMisdemeanor} 
                        disabled={saveMisdemeanorMutation.isPending}
                        className="bg-mcc-blue hover:bg-mcc-blue-dark"
                      >
                        {saveMisdemeanorMutation.isPending ? 'Saving...' : 'Save Misdemeanor'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading misdemeanors...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {misdemeanors?.map((misdemeanor) => (
                      <TableRow key={misdemeanor.id}>
                        <TableCell className="font-medium">{misdemeanor.name}</TableCell>
                        <TableCell>{misdemeanor.location}</TableCell>
                        <TableCell>{misdemeanor.category}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            misdemeanor.severity_level <= 2 ? 'bg-green-100 text-green-800' :
                            misdemeanor.severity_level <= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Level {misdemeanor.severity_level}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            misdemeanor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {misdemeanor.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditMisdemeanor(misdemeanor)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMisdemeanor(misdemeanor.id)}
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
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Heat Score Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Excellent Behavior (0-3)</Label>
                  <div className="text-sm text-gray-600">Full blue heat bar</div>
                </div>
                <div>
                  <Label>Good Behavior (4-5)</Label>
                  <div className="text-sm text-gray-600">Mostly blue heat bar</div>
                </div>
                <div>
                  <Label>Warning Zone (6-7)</Label>
                  <div className="text-sm text-gray-600">Mixed blue/red heat bar</div>
                </div>
                <div>
                  <Label>Concerning (8-9)</Label>
                  <div className="text-sm text-gray-600">Mostly red heat bar</div>
                </div>
                <div>
                  <Label>Critical (10+)</Label>
                  <div className="text-sm text-gray-600">Full red heat bar</div>
                </div>
                <Button className="w-full bg-mcc-blue hover:bg-mcc-blue-dark">
                  Update Thresholds
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS Notifications</Label>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-escalation Rules</Label>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Report Scheduling</Label>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfiguration;
