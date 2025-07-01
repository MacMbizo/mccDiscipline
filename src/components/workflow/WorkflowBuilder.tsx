
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, ArrowRight } from 'lucide-react';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  config: any;
}

interface WorkflowBuilderProps {
  onSave: (workflow: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ onSave, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [steps, setSteps] = useState<WorkflowStep[]>(initialData?.steps || []);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const availableTriggers = [
    { id: 'heat_score_threshold', name: 'Heat Score Threshold', description: 'When student heat score reaches a certain level' },
    { id: 'incident_count', name: 'Multiple Incidents', description: 'When student has multiple incidents in a time period' },
    { id: 'repeat_offense', name: 'Repeat Offense', description: 'When student commits the same offense again' },
    { id: 'merit_milestone', name: 'Merit Milestone', description: 'When student reaches merit point milestone' },
    { id: 'time_based', name: 'Time-based', description: 'Scheduled trigger at specific times' }
  ];

  const availableActions = [
    { id: 'send_email', name: 'Send Email', description: 'Send email notification to specified recipients' },
    { id: 'send_sms', name: 'Send SMS', description: 'Send SMS alert to phone numbers' },
    { id: 'create_meeting', name: 'Schedule Meeting', description: 'Create a meeting request' },
    { id: 'flag_student', name: 'Flag Student', description: 'Add a flag or alert to student record' },
    { id: 'escalate', name: 'Escalate', description: 'Escalate to higher authority' },
    { id: 'log_task', name: 'Create Task', description: 'Log a follow-up task' }
  ];

  const addStep = (type: 'trigger' | 'condition' | 'action') => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      type,
      config: {}
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const updateStepConfig = (stepId: string, config: any) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, config: { ...step.config, ...config } } : step
    ));
  };

  const handleSave = () => {
    const workflow = {
      id: initialData?.id || Date.now().toString(),
      name,
      description,
      steps,
      isActive,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(workflow);
  };

  const renderStepConfig = (step: WorkflowStep) => {
    switch (step.type) {
      case 'trigger':
        return (
          <div className="space-y-3">
            <Select 
              value={step.config.triggerType} 
              onValueChange={(value) => updateStepConfig(step.id, { triggerType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                {availableTriggers.map(trigger => (
                  <SelectItem key={trigger.id} value={trigger.id}>
                    {trigger.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {step.config.triggerType === 'heat_score_threshold' && (
              <div>
                <Label>Heat Score Threshold</Label>
                <Input
                  type="number"
                  value={step.config.threshold || ''}
                  onChange={(e) => updateStepConfig(step.id, { threshold: e.target.value })}
                  placeholder="e.g., 8"
                />
              </div>
            )}
            
            {step.config.triggerType === 'incident_count' && (
              <div className="space-y-2">
                <div>
                  <Label>Number of Incidents</Label>
                  <Input
                    type="number"
                    value={step.config.incidentCount || ''}
                    onChange={(e) => updateStepConfig(step.id, { incidentCount: e.target.value })}
                    placeholder="e.g., 3"
                  />
                </div>
                <div>
                  <Label>Time Period (days)</Label>
                  <Input
                    type="number"
                    value={step.config.timePeriod || ''}
                    onChange={(e) => updateStepConfig(step.id, { timePeriod: e.target.value })}
                    placeholder="e.g., 7"
                  />
                </div>
              </div>
            )}
          </div>
        );
        
      case 'action':
        return (
          <div className="space-y-3">
            <Select 
              value={step.config.actionType} 
              onValueChange={(value) => updateStepConfig(step.id, { actionType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                {availableActions.map(action => (
                  <SelectItem key={action.id} value={action.id}>
                    {action.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(step.config.actionType === 'send_email' || step.config.actionType === 'send_sms') && (
              <div>
                <Label>Recipients</Label>
                <Input
                  value={step.config.recipients || ''}
                  onChange={(e) => updateStepConfig(step.id, { recipients: e.target.value })}
                  placeholder="admin@school.com, parent@email.com"
                />
              </div>
            )}
            
            <div>
              <Label>Delay (minutes)</Label>
              <Input
                type="number"
                value={step.config.delayMinutes || '0'}
                onChange={(e) => updateStepConfig(step.id, { delayMinutes: e.target.value })}
                placeholder="0 for immediate"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Workflow' : 'Create New Workflow'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workflow name"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <Label htmlFor="is-active">Active</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="workflow-description">Description</Label>
          <Textarea
            id="workflow-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this workflow does..."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Workflow Steps</h3>
            <div className="space-x-2">
              <Button size="sm" variant="outline" onClick={() => addStep('trigger')}>
                <Plus className="h-4 w-4 mr-1" />
                Trigger
              </Button>
              <Button size="sm" variant="outline" onClick={() => addStep('action')}>
                <Plus className="h-4 w-4 mr-1" />
                Action
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={step.type === 'trigger' ? 'default' : 'secondary'}>
                      {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-600">Step {index + 1}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeStep(step.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {renderStepConfig(step)}
              </div>
            ))}

            {steps.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No steps added yet. Click the buttons above to add workflow steps.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name || steps.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowBuilder;
