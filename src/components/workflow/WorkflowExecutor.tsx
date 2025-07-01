
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Mail,
  MessageSquare,
  Calendar,
  Flag
} from 'lucide-react';

interface WorkflowExecution {
  id: string;
  workflowId: string;
  studentId: string;
  triggeredBy: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  currentStep: number;
  totalSteps: number;
  progress: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
  logs: string[];
}

interface WorkflowExecutorProps {
  workflow: any;
  studentId?: string;
  onExecutionComplete?: (result: any) => void;
}

const WorkflowExecutor: React.FC<WorkflowExecutorProps> = ({ 
  workflow, 
  studentId, 
  onExecutionComplete 
}) => {
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

  const executeStep = async (step: any, executionId: string) => {
    console.log(`Executing step: ${step.type}`, step.config);
    
    try {
      switch (step.config.actionType || step.config.triggerType) {
        case 'send_email':
          await simulateEmailSending(step.config.recipients);
          break;
        case 'send_sms':
          await simulateSMSSending(step.config.recipients);
          break;
        case 'create_meeting':
          await simulateMeetingCreation();
          break;
        case 'flag_student':
          await simulateStudentFlagging(studentId);
          break;
        case 'escalate':
          await simulateEscalation();
          break;
        case 'log_task':
          await simulateTaskCreation();
          break;
        default:
          console.log('Unknown step type, simulating generic action');
      }
      
      // Add delay if specified
      if (step.config.delayMinutes && parseInt(step.config.delayMinutes) > 0) {
        console.log(`Waiting ${step.config.delayMinutes} minutes...`);
        // In real implementation, this would be handled by a background job
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1 second for demo
      }
      
      return { success: true };
    } catch (error) {
      console.error('Step execution failed:', error);
      return { success: false, error: error.message };
    }
  };

  const simulateEmailSending = async (recipients: string) => {
    console.log('Sending email to:', recipients);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { messageId: 'email_' + Date.now() };
  };

  const simulateSMSSending = async (recipients: string) => {
    console.log('Sending SMS to:', recipients);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { messageId: 'sms_' + Date.now() };
  };

  const simulateMeetingCreation = async () => {
    console.log('Creating meeting request');
    await new Promise(resolve => setTimeout(resolve, 500));
    return { meetingId: 'meeting_' + Date.now() };
  };

  const simulateStudentFlagging = async (studentId: string) => {
    console.log('Flagging student:', studentId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { flagId: 'flag_' + Date.now() };
  };

  const simulateEscalation = async () => {
    console.log('Escalating to administrator');
    await new Promise(resolve => setTimeout(resolve, 500));
    return { escalationId: 'escalation_' + Date.now() };
  };

  const simulateTaskCreation = async () => {
    console.log('Creating follow-up task');
    await new Promise(resolve => setTimeout(resolve, 500));
    return { taskId: 'task_' + Date.now() };
  };

  const executeWorkflow = async () => {
    if (!workflow || !workflow.steps || workflow.steps.length === 0) {
      toast({
        title: "Error",
        description: "No valid workflow steps to execute",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    
    const executionId = Date.now().toString();
    const newExecution: WorkflowExecution = {
      id: executionId,
      workflowId: workflow.id,
      studentId: studentId || 'demo-student',
      triggeredBy: 'manual',
      status: 'running',
      currentStep: 0,
      totalSteps: workflow.steps.length,
      progress: 0,
      startedAt: new Date().toISOString(),
      logs: ['Workflow execution started']
    };

    setExecution(newExecution);

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        
        // Update current step
        setExecution(prev => prev ? {
          ...prev,
          currentStep: i + 1,
          progress: ((i + 1) / workflow.steps.length) * 100,
          logs: [...prev.logs, `Executing step ${i + 1}: ${step.type}`]
        } : null);

        const result = await executeStep(step, executionId);
        
        if (!result.success) {
          setExecution(prev => prev ? {
            ...prev,
            status: 'failed',
            error: result.error,
            logs: [...prev.logs, `Step ${i + 1} failed: ${result.error}`]
          } : null);
          
          toast({
            title: "Workflow Failed",
            description: `Step ${i + 1} failed: ${result.error}`,
            variant: "destructive"
          });
          
          setIsExecuting(false);
          return;
        }

        setExecution(prev => prev ? {
          ...prev,
          logs: [...prev.logs, `Step ${i + 1} completed successfully`]
        } : null);
      }

      // Mark as completed
      setExecution(prev => prev ? {
        ...prev,
        status: 'completed',
        completedAt: new Date().toISOString(),
        logs: [...prev.logs, 'Workflow execution completed successfully']
      } : null);

      toast({
        title: "Workflow Completed",
        description: `Successfully executed ${workflow.steps.length} steps`,
      });

      if (onExecutionComplete) {
        onExecutionComplete({ success: true, executionId });
      }

    } catch (error) {
      setExecution(prev => prev ? {
        ...prev,
        status: 'failed',
        error: error.message,
        logs: [...prev.logs, `Workflow failed: ${error.message}`]
      } : null);

      toast({
        title: "Workflow Error",
        description: error.message,
        variant: "destructive"
      });
    }

    setIsExecuting(false);
  };

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'send_email': return <Mail className="h-4 w-4" />;
      case 'send_sms': return <MessageSquare className="h-4 w-4" />;
      case 'create_meeting': return <Calendar className="h-4 w-4" />;
      case 'flag_student': return <Flag className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      case 'paused': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Workflow Execution: {workflow.name}
            </CardTitle>
            <Button 
              onClick={executeWorkflow} 
              disabled={isExecuting}
              className="flex items-center gap-2"
            >
              {isExecuting ? <Clock className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {isExecuting ? 'Executing...' : 'Execute Workflow'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {execution && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(execution.status)}>
                  {execution.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  Step {execution.currentStep} of {execution.totalSteps}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(execution.progress)}%</span>
                </div>
                <Progress value={execution.progress} className="h-2" />
              </div>

              {execution.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-red-700 text-sm mt-1">{execution.error}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Execution Log</h4>
                <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {execution.logs.map((log, index) => (
                    <div key={index} className="text-sm text-gray-700 py-1">
                      <span className="text-gray-500">
                        [{new Date().toLocaleTimeString()}]
                      </span>{' '}
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!execution && (
            <div className="text-center py-8 text-gray-500">
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to Execute</h3>
              <p>Click "Execute Workflow" to run this automation workflow.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {workflow.steps && workflow.steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow Steps Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStepIcon(step.config.actionType || step.config.triggerType)}
                    <span className="font-medium capitalize">{step.type}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      {step.config.actionType || step.config.triggerType || 'Configured step'}
                      {step.config.delayMinutes && parseInt(step.config.delayMinutes) > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          (Delay: {step.config.delayMinutes}m)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowExecutor;
