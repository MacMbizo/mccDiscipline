
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useStudents } from '@/hooks/useStudents';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { 
  Gift, 
  Trophy, 
  Star, 
  Award, 
  Check,
  Clock,
  AlertCircle,
  User
} from 'lucide-react';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'physical' | 'privilege' | 'experience' | 'recognition';
  icon: React.ReactNode;
  available: boolean;
  estimatedDelivery?: string;
}

interface RedemptionRequest {
  id: string;
  studentId: string;
  studentName: string;
  rewardId: string;
  rewardName: string;
  pointsCost: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: string;
  notes?: string;
}

interface RewardRedemptionProps {
  className?: string;
}

const RewardRedemption: React.FC<RewardRedemptionProps> = ({ className = "" }) => {
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [redemptionRequests, setRedemptionRequests] = useState<RedemptionRequest[]>([
    {
      id: '1',
      studentId: 'student-1',
      studentName: 'John Smith',
      rewardId: 'homework-pass',
      rewardName: 'Homework Pass',
      pointsCost: 50,
      status: 'pending',
      requestedAt: new Date('2023-09-15T10:30:00'),
    },
    {
      id: '2',
      studentId: 'student-2',
      studentName: 'Sarah Johnson',
      rewardId: 'extra-break',
      rewardName: 'Extra Break Time',
      pointsCost: 30,
      status: 'approved',
      requestedAt: new Date('2023-09-14T14:20:00'),
      processedAt: new Date('2023-09-14T15:00:00'),
      processedBy: 'Admin User'
    }
  ]);
  
  const { data: students = [] } = useStudents();
  const { data: records = [] } = useBehaviorRecords();
  const { toast } = useToast();

  const availableRewards: RewardItem[] = [
    {
      id: 'homework-pass',
      name: 'Homework Pass',
      description: 'Skip one homework assignment',
      pointsCost: 50,
      category: 'privilege',
      icon: <Star className="h-5 w-5" />,
      available: true,
      estimatedDelivery: 'Immediate'
    },
    {
      id: 'lunch-voucher',
      name: 'Cafeteria Voucher',
      description: 'Free lunch voucher',
      pointsCost: 75,
      category: 'physical',
      icon: <Gift className="h-5 w-5" />,
      available: true,
      estimatedDelivery: '1-2 days'
    },
    {
      id: 'extra-break',
      name: 'Extra Break Time',
      description: '15 minutes extra break',
      pointsCost: 30,
      category: 'privilege',
      icon: <Clock className="h-5 w-5" />,
      available: true,
      estimatedDelivery: 'Next day'
    },
    {
      id: 'certificate',
      name: 'Achievement Certificate',
      description: 'Personalized achievement certificate',
      pointsCost: 100,
      category: 'recognition',
      icon: <Award className="h-5 w-5" />,
      available: true,
      estimatedDelivery: '3-5 days'
    }
  ];

  const handleRedemptionRequest = (studentId: string, reward: RewardItem) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const studentMerits = records.filter(r => r.student_id === studentId && r.type === 'merit');
    const totalPoints = studentMerits.reduce((sum, merit) => sum + (merit.points || 0), 0);

    if (totalPoints < reward.pointsCost) {
      toast({
        title: "Insufficient Points",
        description: `${student.name} has ${totalPoints} points but needs ${reward.pointsCost} points`,
        variant: "destructive"
      });
      return;
    }

    const newRequest: RedemptionRequest = {
      id: Date.now().toString(),
      studentId,
      studentName: student.name,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsCost: reward.pointsCost,
      status: 'pending',
      requestedAt: new Date()
    };

    setRedemptionRequests(prev => [newRequest, ...prev]);
    setConfirmationDialog(false);
    setSelectedReward(null);
    setSelectedStudent('');

    toast({
      title: "Redemption Requested",
      description: `${student.name}'s request for ${reward.name} has been submitted`,
    });
  };

  const handleApproveRedemption = (requestId: string, approve: boolean) => {
    setRedemptionRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: approve ? 'approved' : 'rejected',
          processedAt: new Date(),
          processedBy: 'Current User', // In real app, get from auth context
          notes: approve ? 'Approved by administrator' : 'Rejected by administrator'
        };
      }
      return request;
    }));

    toast({
      title: approve ? "Redemption Approved" : "Redemption Rejected",
      description: `Request has been ${approve ? 'approved' : 'rejected'}`,
    });
  };

  const handleCompleteRedemption = (requestId: string) => {
    setRedemptionRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: 'completed',
          processedAt: new Date(),
          processedBy: 'Current User'
        };
      }
      return request;
    }));

    toast({
      title: "Redemption Completed",
      description: "Reward has been delivered to student",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'completed': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <Check className="h-4 w-4" />;
      case 'completed': return <Trophy className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward) => (
              <div key={reward.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{reward.name}</h3>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-blue-600">
                    {reward.pointsCost} points
                  </div>
                  <Badge variant="outline">{reward.category}</Badge>
                </div>
                
                {reward.estimatedDelivery && (
                  <p className="text-xs text-gray-500">
                    Delivery: {reward.estimatedDelivery}
                  </p>
                )}
                
                <Dialog open={confirmationDialog && selectedReward?.id === reward.id} onOpenChange={setConfirmationDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => {
                        setSelectedReward(reward);
                        setConfirmationDialog(true);
                      }}
                      disabled={!reward.available}
                    >
                      Request Redemption
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Redemption Request</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <Alert>
                        <Gift className="h-4 w-4" />
                        <AlertDescription>
                          You are requesting <strong>{reward.name}</strong> for <strong>{reward.pointsCost} points</strong>
                        </AlertDescription>
                      </Alert>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Student</label>
                        <select 
                          className="w-full p-2 border rounded-lg"
                          value={selectedStudent}
                          onChange={(e) => setSelectedStudent(e.target.value)}
                        >
                          <option value="">Choose a student...</option>
                          {students.map((student) => {
                            const studentMerits = records.filter(r => r.student_id === student.id && r.type === 'merit');
                            const totalPoints = studentMerits.reduce((sum, merit) => sum + (merit.points || 0), 0);
                            
                            return (
                              <option key={student.id} value={student.id}>
                                {student.name} - {student.grade} ({totalPoints} points)
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setConfirmationDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleRedemptionRequest(selectedStudent, reward)}
                          disabled={!selectedStudent}
                        >
                          Confirm Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Redemption Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Redemption Requests ({redemptionRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {redemptionRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No redemption requests yet</p>
              </div>
            ) : (
              redemptionRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          Requested: {request.rewardName} ({request.pointsCost} points)
                        </p>
                        <p className="text-xs text-gray-500">
                          {request.requestedAt.toLocaleDateString()} at {request.requestedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(request.status) as any} className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveRedemption(request.id, true)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleApproveRedemption(request.id, false)}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                  
                  {request.status === 'approved' && (
                    <div className="mt-4">
                      <Button 
                        size="sm"
                        onClick={() => handleCompleteRedemption(request.id)}
                      >
                        <Trophy className="h-4 w-4 mr-1" />
                        Mark as Completed
                      </Button>
                    </div>
                  )}
                  
                  {request.processedAt && (
                    <div className="mt-2 text-xs text-gray-500">
                      Processed on {request.processedAt.toLocaleDateString()} by {request.processedBy}
                      {request.notes && <span> - {request.notes}</span>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardRedemption;
