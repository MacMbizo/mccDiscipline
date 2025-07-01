
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Zap, 
  Plus,
  Settings,
  Play,
  Pause,
  Trash2,
  Edit,
  AlertTriangle
} from 'lucide-react';
import WorkflowBuilder from './WorkflowBuilder';
import WorkflowExecutor from './WorkflowExecutor';
import { useToast } from '@/hooks/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  steps: any[];
  isActive: boolean;
  autoExecute: boolean;
  lastTriggered?: string;
  triggerCount: number;
  createdAt: string;
  updatedAt: string;
}

interface AutomationWorkflowsProps {
  className?: string;
}

const AutomationWorkflows: React.FC<AutomationWorkflowsProps> = ({ className = "" }) => {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Critical Behavior Alert',
      description: 'Send immediate notification when student reaches heat score of 8+',
      steps: [
        {
          id: '1',
          type: 'trigger',
          config: { triggerType: 'heat_score_threshold', threshold: '8' }
        },
        {
          id: '2',
          type: 'action',
          config: { actionType: 'send_email', recipients: 'admin@school.com', delayMinutes: '0' }
        },
        {
          id: '3',
          type: 'action',
          config: { actionType: 'flag_student', delayMinutes: '5' }
        }
      ],
      isActive: true,
      autoExecute: true,
      lastTriggered: '2023-09-15',
      triggerCount: 3,
      createdAt: '2023-09-01',
      updatedAt: '2023-09-15'
    },
    {
      id: '2',
      name: 'Parent Communication Trigger',
      description: 'Auto-schedule parent meeting after 2nd offense of same type',
      steps: [
        {
          id: '1',
          type: 'trigger',
          config: { triggerType: 'repeat_offense' }
        },
        {
          id: '2',
          type: 'action',
          config: { actionType: 'send_email', recipients: 'parent@email.com', delayMinutes: '0' }
        },
        {
          id: '3',
          type: 'action',
          config: { actionType: 'create_meeting', delayMinutes: '60' }
        }
      ],
      isActive: true,
      autoExecute: false,
      lastTriggered: '2023-09-14',
      triggerCount: 7,
      createdAt: '2023-08-15',
      updatedAt: '2023-09-14'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [executingRule, setExecutingRule] = useState<AutomationRule | null>(null);
  const [showExecutor, setShowExecutor] = useState(false);
  const { toast } = useToast();

  const toggleRule = (ruleId: string) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
    
    const rule = automationRules.find(r => r.id === ruleId);
    toast({
      title: "Workflow Updated",
      description: `${rule?.name} has been ${rule?.isActive ? 'deactivated' : 'activated'}`,
    });
  };

  const handleSaveWorkflow = (workflowData: any) => {
    if (editingRule) {
      // Update existing rule
      setAutomationRules(rules =>
        rules.map(rule =>
          rule.id === editingRule.id
            ? { ...rule, ...workflowData, updatedAt: new Date().toISOString() }
            : rule
        )
      );
      toast({
        title: "Workflow Updated",
        description: `${workflowData.name} has been updated successfully`,
      });
      setEditingRule(null);
    } else {
      // Create new rule
      const newRule: AutomationRule = {
        ...workflowData,
        triggerCount: 0,
        lastTriggered: undefined,
        autoExecute: false
      };
      setAutomationRules(rules => [...rules, newRule]);
      toast({
        title: "Workflow Created",
        description: `${workflowData.name} has been created successfully`,
      });
      setIsCreating(false);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    const rule = automationRules.find(r => r.id === ruleId);
    setAutomationRules(rules => rules.filter(rule => rule.id !== ruleId));
    toast({
      title: "Workflow Deleted",
      description: `${rule?.name} has been deleted`,
      variant: "destructive"
    });
  };

  const handleExecuteRule = (rule: AutomationRule) => {
    setExecutingRule(rule);
    setShowExecutor(true);
  };

  const handleExecutionComplete = (result: any) => {
    if (result.success) {
      // Update trigger count and last triggered time
      setAutomationRules(rules =>
        rules.map(rule =>
          rule.id === executingRule?.id
            ? {
                ...rule,
                triggerCount: rule.triggerCount + 1,
                lastTriggered: new Date().toISOString().split('T')[0]
              }
            : rule
        )
      );
    }
    setShowExecutor(false);
    setExecutingRule(null);
  };

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
                <p className="text-sm text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-green-600">
                  {automationRules.reduce((sum, rule) => sum + rule.triggerCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Auto-Execute</p>
                <p className="text-2xl font-bold text-purple-600">
                  {automationRules.filter(r => r.autoExecute).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-orange-600">0</p>
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
                      {rule.autoExecute && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Auto-Execute
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{rule.steps.length} steps</span>
                      <span>Triggered {rule.triggerCount} times</span>
                      {rule.lastTriggered && (
                        <span>Last: {rule.lastTriggered}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExecuteRule(rule)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingRule(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Workflow Dialog */}
      <Dialog open={isCreating || editingRule !== null} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setEditingRule(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Edit Workflow' : 'Create New Workflow'}
            </DialogTitle>
          </DialogHeader>
          <WorkflowBuilder
            initialData={editingRule}
            onSave={handleSaveWorkflow}
            onCancel={() => {
              setIsCreating(false);
              setEditingRule(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Execute Workflow Dialog */}
      <Dialog open={showExecutor} onOpenChange={setShowExecutor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Execute Workflow</DialogTitle>
          </DialogHeader>
          {executingRule && (
            <WorkflowExecutor
              workflow={executingRule}
              onExecutionComplete={handleExecutionComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomationWorkflows;
