
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  AlertTriangle, 
  Mail, 
  Bell, 
  Calendar,
  Users,
  ArrowRight,
  Settings,
  Plus,
  Play,
  Pause
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  isActive: boolean;
  lastTriggered?: string;
  triggerCount: number;
}

interface AutomationWorkflowsProps {
  className?: string;
}

const AutomationWorkflows: React.FC<AutomationWorkflowsProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState('rules');
  const [isCreating, setIsCreating] = useState(false);

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Critical Behavior Alert',
      description: 'Send immediate notification when student reaches heat score of 8+',
      trigger: 'Heat Score >= 8',
      conditions: ['Student has 3+ incidents in last 7 days', 'No recent merit points'],
      actions: ['Email Admin', 'SMS Parent', 'Schedule Meeting'],
      isActive: true,
      lastTriggered: '2023-09-15',
      triggerCount: 3
    },
    {
      id: '2',
      name: 'Parent Communication Trigger',
      description: 'Auto-schedule parent meeting after 2nd offense of same type',
      trigger: '2nd Offense of Same Type',
      conditions: ['Same misdemeanor within 30 days', 'Student grade 8-10'],
      actions: ['Send Parent Email', 'Create Meeting Request', 'Log Follow-up Task'],
      isActive: true,
      lastTriggered: '2023-09-14',
      triggerCount: 7
    },
    {
      id: '3',
      name: 'Merit Recognition Boost',
      description: 'Suggest merit award when student shows improvement',
      trigger: 'Heat Score Decreases by 2+',
      conditions: ['No incidents in last 14 days', 'Previous heat score > 5'],
      actions: ['Notify Teachers', 'Suggest Merit Award', 'Update Progress'],
      isActive: false,
      lastTriggered: '2023-09-10',
      triggerCount: 12
    }
  ]);

  const toggleRule = (ruleId: string) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const availableTriggers = [
    'Heat Score Threshold',
    'Multiple Incidents',
    'Repeat Offense',
    'Time-based Trigger',
    'Merit Milestone',
    'Behavioral Improvement',
    'Teacher Flag',
    'Parent Contact Request'
  ];

  const availableActions = [
    'Send Email Notification',
    'Send SMS Alert',
    'Create Meeting Request',
    'Log Follow-up Task',
    'Update Student Flag',
    'Generate Report',
    'Escalate to Admin',
    'Schedule Intervention'
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Automation Workflows</h2>
          <p className="text-gray-600">Streamline processes with intelligent automation</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-blue-600">
                  {automationRules.filter(r => r.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Triggered Today</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Notifications Sent</p>
                <p className="text-2xl font-bold text-purple-600">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Efficiency Gain</p>
                <p className="text-2xl font-bold text-orange-600">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automation Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-1">Trigger</h4>
                        <p className="text-gray-600">{rule.trigger}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Conditions</h4>
                        <ul className="text-gray-600 space-y-1">
                          {rule.conditions.map((condition, index) => (
                            <li key={index} className="text-xs">• {condition}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Actions</h4>
                        <ul className="text-gray-600 space-y-1">
                          {rule.actions.map((action, index) => (
                            <li key={index} className="text-xs">• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t text-sm text-gray-600">
                  <span>Triggered {rule.triggerCount} times</span>
                  {rule.lastTriggered && (
                    <span>Last: {rule.lastTriggered}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Builder Modal/Panel */}
      {isCreating && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Create New Automation Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-name">Workflow Name</Label>
                <Input id="rule-name" placeholder="Enter workflow name" />
              </div>
              <div>
                <Label htmlFor="trigger-type">Trigger Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTriggers.map((trigger) => (
                      <SelectItem key={trigger} value={trigger.toLowerCase().replace(/\s+/g, '-')}>
                        {trigger}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this workflow does..."
                className="h-20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Conditions</Label>
                <div className="space-y-2 mt-2">
                  <Input placeholder="Add condition..." />
                  <Button size="sm" variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Condition
                  </Button>
                </div>
              </div>
              <div>
                <Label>Actions</Label>
                <div className="space-y-2 mt-2">
                  {availableActions.slice(0, 3).map((action) => (
                    <label key={action} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{action}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreating(false)}>
                Create Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutomationWorkflows;
