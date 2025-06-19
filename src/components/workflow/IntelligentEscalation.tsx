
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Zap,
  Brain,
  Bell,
  Calendar
} from 'lucide-react';

interface EscalationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: EscalationAction[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  isActive: boolean;
  autoExecute: boolean;
  lastTriggered?: string;
}

interface EscalationAction {
  type: 'notify' | 'schedule' | 'assign' | 'escalate' | 'document';
  target: string;
  delay: number; // minutes
  conditions?: string[];
}

interface ActiveEscalation {
  id: string;
  studentId: string;
  ruleId: string;
  currentStep: number;
  totalSteps: number;
  status: 'pending' | 'in_progress' | 'completed' | 'paused';
  nextAction: string;
  nextActionTime: string;
  assignedTo: string;
  progress: number;
}

interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  recipients: string[];
  method: 'email' | 'sms' | 'push' | 'all';
  timing: 'immediate' | 'scheduled' | 'adaptive';
  template: string;
  isActive: boolean;
}

interface IntelligentEscalationProps {
  className?: string;
}

const IntelligentEscalation: React.FC<IntelligentEscalationProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState('escalations');
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([]);
  const [activeEscalations, setActiveEscalations] = useState<ActiveEscalation[]>([]);
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([]);

  useEffect(() => {
    // Mock data
    setEscalationRules([
      {
        id: '1',
        name: 'Critical Behavior Escalation',
        trigger: 'Heat Score >= 8',
        conditions: ['3+ incidents in 7 days', 'Previous interventions unsuccessful'],
        actions: [
          { type: 'notify', target: 'admin@school.com', delay: 0 },
          { type: 'schedule', target: 'counseling', delay: 60 },
          { type: 'notify', target: 'parent', delay: 120 },
          { type: 'escalate', target: 'director', delay: 1440 }
        ],
        priority: 'critical',
        isActive: true,
        autoExecute: true,
        lastTriggered: '2023-09-15'
      },
      {
        id: '2',
        name: 'Repeat Offense Protocol',
        trigger: '2nd offense of same type',
        conditions: ['Same misdemeanor within 30 days'],
        actions: [
          { type: 'notify', target: 'form_teacher', delay: 0 },
          { type: 'schedule', target: 'parent_meeting', delay: 1440 },
          { type: 'document', target: 'behavioral_plan', delay: 2880 }
        ],
        priority: 'high',
        isActive: true,
        autoExecute: false
      }
    ]);

    setActiveEscalations([
      {
        id: '1',
        studentId: 'student-123',
        ruleId: '1',
        currentStep: 2,
        totalSteps: 4,
        status: 'in_progress',
        nextAction: 'Parent Notification',
        nextActionTime: '2023-09-15T14:30:00Z',
        assignedTo: 'Mrs. Johnson',
        progress: 50
      },
      {
        id: '2',
        studentId: 'student-456',
        ruleId: '2',
        currentStep: 1,
        totalSteps: 3,
        status: 'pending',
        nextAction: 'Schedule Parent Meeting',
        nextActionTime: '2023-09-16T09:00:00Z',
        assignedTo: 'Mr. Roberts',
        progress: 33
      }
    ]);

    setNotificationRules([
      {
        id: '1',
        name: 'Immediate Incident Alert',
        trigger: 'High severity incident logged',
        recipients: ['admin', 'form_teacher'],
        method: 'all',
        timing: 'immediate',
        template: 'High severity incident requires immediate attention for {{student_name}}',
        isActive: true
      },
      {
        id: '2',
        name: 'Daily Parent Summary',
        trigger: 'End of school day',
        recipients: ['parent'],
        method: 'email',
        timing: 'scheduled',
        template: 'Daily behavior summary for {{student_name}}',
        isActive: true
      }
    ]);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-600" />
            Intelligent Escalation & Automation
          </h2>
          <p className="text-gray-600">Smart routing and automated workflows for behavioral management</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Configure Rules
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ArrowRight className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Escalations</p>
                <p className="text-2xl font-bold text-orange-600">{activeEscalations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-blue-600">12m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Notifications Sent</p>
                <p className="text-2xl font-bold text-purple-600">247</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Escalations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Active Escalations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeEscalations.map((escalation) => (
              <div key={escalation.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(escalation.status)}>
                      {escalation.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="font-medium">Student ID: {escalation.studentId}</span>
                    <span className="text-sm text-gray-600">
                      Step {escalation.currentStep} of {escalation.totalSteps}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Assigned to: {escalation.assignedTo}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">{escalation.progress}%</span>
                  </div>
                  <Progress value={escalation.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{escalation.nextAction}</div>
                    <div className="text-sm text-gray-600">
                      Scheduled: {new Date(escalation.nextActionTime).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Step
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Escalation Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {escalationRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{rule.name}</h3>
                    <Badge className={getPriorityColor(rule.priority)}>
                      {rule.priority.toUpperCase()}
                    </Badge>
                    {rule.autoExecute && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        <Brain className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h4 className="font-medium mb-2">Trigger</h4>
                    <p className="text-sm text-gray-600">{rule.trigger}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Conditions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {rule.conditions.map((condition, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Escalation Path</h4>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {rule.actions.map((action, index) => (
                      <React.Fragment key={index}>
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 min-w-fit">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="text-sm">
                            <div className="font-medium capitalize">{action.type}</div>
                            <div className="text-gray-600">{action.target}</div>
                            {action.delay > 0 && (
                              <div className="text-xs text-gray-500">
                                +{action.delay}m
                              </div>
                            )}
                          </div>
                        </div>
                        {index < rule.actions.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {rule.lastTriggered && (
                  <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                    Last triggered: {rule.lastTriggered}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Dynamic Notification Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{rule.name}</h3>
                    <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Trigger</h4>
                    <p className="text-sm text-gray-600">{rule.trigger}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Recipients</h4>
                    <p className="text-sm text-gray-600">{rule.recipients.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Method & Timing</h4>
                    <p className="text-sm text-gray-600">
                      {rule.method} • {rule.timing}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="font-medium mb-1">Template</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {rule.template}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentEscalation;
