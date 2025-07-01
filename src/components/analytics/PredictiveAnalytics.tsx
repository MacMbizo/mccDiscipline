import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { useStudents } from '@/hooks/useStudents';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Brain,
  Clock,
  Users,
  Calendar,
  ArrowRight,
  FileText,
  Plus,
  CheckCircle,
  XCircle,
  PlayCircle
} from 'lucide-react';

interface RiskPrediction {
  studentId: string;
  studentName: string;
  form: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  predictedOutcome: string;
  interventionSuggestion: string;
  timeline: string;
  factors: string[];
}

interface InterventionPlan {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  createdBy: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
}

interface PredictiveAnalyticsProps {
  className?: string;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ className = "" }) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [interventionDialogOpen, setInterventionDialogOpen] = useState(false);
  const [interventionType, setInterventionType] = useState('');
  const [interventionDescription, setInterventionDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [interventionPlans, setInterventionPlans] = useState<InterventionPlan[]>([
    {
      id: '1',
      studentId: 'student-1',
      studentName: 'John Smith',
      type: 'counseling',
      description: 'Individual counseling sessions to address behavioral concerns',
      assignedTo: 'Dr. Sarah Johnson',
      dueDate: '2023-09-25',
      status: 'in-progress',
      createdAt: new Date('2023-09-15'),
      createdBy: 'Admin User',
      priority: 'high'
    }
  ]);
  
  const { data: records = [] } = useBehaviorRecords();
  const { data: students = [] } = useStudents();
  const { toast } = useToast();

  // Advanced risk assessment algorithm
  const riskPredictions = React.useMemo(() => {
    return students.map(student => {
      const studentRecords = records.filter(r => r.student_id === student.id);
      const incidents = studentRecords.filter(r => r.type === 'incident');
      const merits = studentRecords.filter(r => r.type === 'merit');
      
      // Time-based analysis
      const now = new Date();
      const recentIncidents = incidents.filter(i => 
        new Date(i.timestamp || '') > new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
      );
      const veryRecentIncidents = incidents.filter(i => 
        new Date(i.timestamp || '') > new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000))
      );

      // Pattern analysis
      const escalationPattern = incidents.slice(-5).every((incident, index, arr) => 
        index === 0 || new Date(incident.timestamp || '') > new Date(arr[index - 1].timestamp || '')
      );

      const repeatOffenses = incidents.reduce((acc, incident) => {
        const type = incident.misdemeanor?.name || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Risk scoring algorithm
      let riskScore = 0;
      const factors: string[] = [];

      // Current behavior score impact
      const currentScore = student.behavior_score || 0;
      if (currentScore > 7) {
        riskScore += 40;
        factors.push('High current behavior score');
      } else if (currentScore > 5) {
        riskScore += 20;
        factors.push('Elevated behavior score');
      }

      // Recent activity impact
      if (veryRecentIncidents.length > 2) {
        riskScore += 30;
        factors.push('Multiple recent incidents');
      } else if (recentIncidents.length > 3) {
        riskScore += 20;
        factors.push('Frequent monthly incidents');
      }

      // Escalation pattern
      if (escalationPattern && incidents.length > 3) {
        riskScore += 25;
        factors.push('Escalating pattern detected');
      }

      // Repeat offenses
      const maxRepeats = Math.max(...Object.values(repeatOffenses));
      if (maxRepeats > 3) {
        riskScore += 20;
        factors.push('Repeat offense pattern');
      }

      // Merit balance
      const recentMerits = merits.filter(m => 
        new Date(m.timestamp || '') > new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
      );
      
      if (recentMerits.length === 0 && recentIncidents.length > 0) {
        riskScore += 15;
        factors.push('No recent positive recognition');
      }

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';
      if (riskScore >= 80) riskLevel = 'critical';
      else if (riskScore >= 60) riskLevel = 'high';
      else if (riskScore >= 40) riskLevel = 'medium';
      else riskLevel = 'low';

      // Generate predictions and suggestions
      const predictions = {
        critical: {
          outcome: 'High risk of suspension or exclusion within 2 weeks',
          intervention: 'Immediate counseling session, parent meeting, and behavior contract',
          timeline: 'Immediate action required'
        },
        high: {
          outcome: 'Likely to reach critical threshold within 1 month',
          intervention: 'Schedule counseling, implement behavior monitoring plan',
          timeline: 'Within 1 week'
        },
        medium: {
          outcome: 'May escalate without intervention within 6 weeks',
          intervention: 'Teacher check-ins, positive reinforcement program',
          timeline: 'Within 2 weeks'
        },
        low: {
          outcome: 'Low risk of behavioral issues',
          intervention: 'Continue current positive approach',
          timeline: 'Monitor monthly'
        }
      };

      return {
        studentId: student.id,
        studentName: student.name,
        form: student.grade,
        riskLevel,
        riskScore,
        predictedOutcome: predictions[riskLevel].outcome,
        interventionSuggestion: predictions[riskLevel].intervention,
        timeline: predictions[riskLevel].timeline,
        factors
      } as RiskPrediction;
    }).filter(p => p.riskLevel !== 'low').sort((a, b) => b.riskScore - a.riskScore);
  }, [students, records]);

  const createInterventionPlan = async () => {
    if (!selectedStudent || !interventionType || !interventionDescription || !assignedTo || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedStudentData = students.find(s => s.id === selectedStudent);
      
      const newPlan: InterventionPlan = {
        id: Date.now().toString(),
        studentId: selectedStudent,
        studentName: selectedStudentData?.name || 'Unknown Student',
        type: interventionType,
        description: interventionDescription,
        assignedTo: assignedTo,
        dueDate: dueDate,
        status: 'pending',
        createdAt: new Date(),
        createdBy: 'Current User', // In real app, get from auth context
        priority: priority,
        notes: ''
      };

      // Save to state (in real app, this would save to database)
      setInterventionPlans(prev => [newPlan, ...prev]);

      // Reset form and close dialog
      setInterventionDialogOpen(false);
      resetForm();

      toast({
        title: "Intervention Plan Created",
        description: `Intervention plan has been created for ${selectedStudentData?.name}`,
      });

      console.log('Intervention Plan Saved:', newPlan);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create intervention plan",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setSelectedStudent('');
    setInterventionType('');
    setInterventionDescription('');
    setAssignedTo('');
    setDueDate('');
    setPriority('medium');
  };

  const updatePlanStatus = (planId: string, newStatus: InterventionPlan['status']) => {
    setInterventionPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, status: newStatus } : plan
    ));

    const plan = interventionPlans.find(p => p.id === planId);
    toast({
      title: "Plan Updated",
      description: `${plan?.studentName}'s intervention plan status updated to ${newStatus}`,
    });
  };

  const generateDetailedReport = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const prediction = riskPredictions.find(p => p.studentId === studentId);
    
    if (!student || !prediction) return;

    // Generate detailed analysis report
    const reportData = {
      student: student.name,
      form: student.grade,
      riskScore: prediction.riskScore,
      factors: prediction.factors,
      recommendation: prediction.interventionSuggestion
    };

    // In a real implementation, this would generate and download a PDF
    toast({
      title: "Report Generated",
      description: `Detailed risk assessment report for ${student.name} has been generated`,
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Target className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <PlayCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const criticalAlerts = riskPredictions.filter(p => p.riskLevel === 'critical');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalAlerts.length} student(s)</strong> require immediate intervention. 
            Review the critical risk assessments below.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {riskPredictions.filter(p => p.riskLevel === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-orange-600">
                  {riskPredictions.filter(p => p.riskLevel === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Medium Risk</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {riskPredictions.filter(p => p.riskLevel === 'medium').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-blue-600">
                  {interventionPlans.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment and Intervention Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Assessment List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Predictive Risk Assessment
              </CardTitle>
              
              <Dialog open={interventionDialogOpen} onOpenChange={setInterventionDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Intervention Plan</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Select Student *</Label>
                      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {riskPredictions.map((prediction) => (
                            <SelectItem key={prediction.studentId} value={prediction.studentId}>
                              <div className="flex items-center gap-2">
                                {getRiskIcon(prediction.riskLevel)}
                                <span>{prediction.studentName} - Form {prediction.form}</span>
                                <Badge variant={getRiskColor(prediction.riskLevel) as any} className="ml-2">
                                  {prediction.riskLevel.toUpperCase()}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Intervention Type *</Label>
                        <Select value={interventionType} onValueChange={setInterventionType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select intervention type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="counseling">Individual Counseling</SelectItem>
                            <SelectItem value="parent-meeting">Parent Meeting</SelectItem>
                            <SelectItem value="behavior-contract">Behavior Contract</SelectItem>
                            <SelectItem value="mentoring">Peer Mentoring</SelectItem>
                            <SelectItem value="academic-support">Academic Support</SelectItem>
                            <SelectItem value="monitoring">Behavioral Monitoring</SelectItem>
                            <SelectItem value="suspension">Temporary Suspension</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Priority *</Label>
                        <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description *</Label>
                      <Textarea
                        placeholder="Describe the intervention plan in detail..."
                        value={interventionDescription}
                        onChange={(e) => setInterventionDescription(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Assigned To *</Label>
                        <Input
                          placeholder="Staff member or counselor"
                          value={assignedTo}
                          onChange={(e) => setAssignedTo(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Due Date *</Label>
                        <Input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" onClick={() => {
                        setInterventionDialogOpen(false);
                        resetForm();
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={createInterventionPlan}>
                        Create Plan
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {riskPredictions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No students currently at elevated risk. Great work!</p>
                </div>
              ) : (
                riskPredictions.slice(0, 5).map((prediction) => (
                  <div key={prediction.studentId} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getRiskIcon(prediction.riskLevel)}
                        <div>
                          <h4 className="font-medium text-sm">{prediction.studentName}</h4>
                          <p className="text-xs text-gray-600">Form {prediction.form}</p>
                        </div>
                      </div>
                      <Badge variant={getRiskColor(prediction.riskLevel) as any} className="text-xs">
                        {prediction.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-700">{prediction.predictedOutcome}</p>
                    
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateDetailedReport(prediction.studentId)}
                        className="text-xs h-7"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Report
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(prediction.studentId);
                          setInterventionDialogOpen(true);
                        }}
                        className="text-xs h-7"
                      >
                        Plan
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Intervention Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Intervention Plans ({interventionPlans.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {interventionPlans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No intervention plans created yet</p>
                </div>
              ) : (
                interventionPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{plan.studentName}</h4>
                        <p className="text-xs text-gray-600 capitalize">{plan.type.replace('-', ' ')}</p>
                      </div>
                      <div className="flex gap-1">
                        <Badge variant={getPriorityColor(plan.priority) as any} className="text-xs">
                          {plan.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          {getStatusIcon(plan.status)}
                          {plan.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-700 line-clamp-2">{plan.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      <p>Assigned to: {plan.assignedTo}</p>
                      <p>Due: {new Date(plan.dueDate).toLocaleDateString()}</p>
                    </div>
                    
                    {plan.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => updatePlanStatus(plan.id, 'in-progress')}
                          className="text-xs h-6"
                        >
                          Start
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePlanStatus(plan.id, 'cancelled')}
                          className="text-xs h-6"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    
                    {plan.status === 'in-progress' && (
                      <Button
                        size="sm"
                        onClick={() => updatePlanStatus(plan.id, 'completed')}
                        className="text-xs h-6"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
