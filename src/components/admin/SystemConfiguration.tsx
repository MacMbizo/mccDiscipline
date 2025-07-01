
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Bell, 
  AlertTriangle, 
  Save,
  Mail,
  MessageSquare,
  Smartphone,
  Shield,
  Database,
  Clock
} from 'lucide-react';

interface SystemConfig {
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    digestFrequency: 'immediate' | 'daily' | 'weekly';
    quietHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  thresholds: {
    counselingHeatScore: number;
    criticalHeatScore: number;
    parentNotificationThreshold: number;
    maxIncidentsPerWeek: number;
    interventionTriggerDays: number;
  };
  automation: {
    autoParentNotification: boolean;
    autoEscalation: boolean;
    autoReportGeneration: boolean;
    escalationDelayHours: number;
  };
  security: {
    sessionTimeout: number;
    passwordExpiry: number;
    maxLoginAttempts: number;
    twoFactorRequired: boolean;
  };
  system: {
    maintenanceMode: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    logRetentionDays: number;
    cacheExpiryHours: number;
  };
}

const SystemConfiguration: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>({
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      digestFrequency: 'daily',
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '06:00'
      }
    },
    thresholds: {
      counselingHeatScore: 7.0,
      criticalHeatScore: 9.0,
      parentNotificationThreshold: 3,
      maxIncidentsPerWeek: 5,
      interventionTriggerDays: 7
    },
    automation: {
      autoParentNotification: true,
      autoEscalation: true,
      autoReportGeneration: false,
      escalationDelayHours: 24
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      twoFactorRequired: false
    },
    system: {
      maintenanceMode: false,
      backupFrequency: 'daily',
      logRetentionDays: 365,
      cacheExpiryHours: 24
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const updateConfig = (section: keyof SystemConfig, updates: Partial<SystemConfig[keyof SystemConfig]>) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
    setHasUnsavedChanges(true);
  };

  const saveConfiguration = async () => {
    try {
      // In a real implementation, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasUnsavedChanges(false);
      toast({
        title: "Configuration Saved",
        description: "System configuration has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving the configuration",
        variant: "destructive"
      });
    }
  };

  const resetToDefaults = () => {
    // Reset to default configuration
    setConfig({
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        digestFrequency: 'daily',
        quietHours: {
          enabled: true,
          startTime: '22:00',
          endTime: '06:00'
        }
      },
      thresholds: {
        counselingHeatScore: 7.0,
        criticalHeatScore: 9.0,
        parentNotificationThreshold: 3,
        maxIncidentsPerWeek: 5,
        interventionTriggerDays: 7
      },
      automation: {
        autoParentNotification: true,
        autoEscalation: true,
        autoReportGeneration: false,
        escalationDelayHours: 24
      },
      security: {
        sessionTimeout: 30,
        passwordExpiry: 90,
        maxLoginAttempts: 5,
        twoFactorRequired: false
      },
      system: {
        maintenanceMode: false,
        backupFrequency: 'daily',
        logRetentionDays: 365,
        cacheExpiryHours: 24
      }
    });
    setHasUnsavedChanges(true);
    
    toast({
      title: "Reset to Defaults",
      description: "Configuration has been reset to default values",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">System Configuration</h2>
          <p className="text-gray-600">Configure system settings, notifications, and behavioral thresholds</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={saveConfiguration} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your configuration.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Methods */}
              <div className="space-y-4">
                <h3 className="font-semibold">Notification Methods</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Send notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.notifications.emailEnabled}
                    onCheckedChange={(checked) => updateConfig('notifications', { emailEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Send notifications via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.notifications.smsEnabled}
                    onCheckedChange={(checked) => updateConfig('notifications', { smsEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600">Send in-app push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.notifications.pushEnabled}
                    onCheckedChange={(checked) => updateConfig('notifications', { pushEnabled: checked })}
                  />
                </div>
              </div>

              {/* Digest Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Digest Settings</h3>
                
                <div>
                  <Label>Digest Frequency</Label>
                  <Select 
                    value={config.notifications.digestFrequency} 
                    onValueChange={(value: any) => updateConfig('notifications', { digestFrequency: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={config.notifications.quietHours.enabled}
                    onCheckedChange={(checked) => updateConfig('notifications', { 
                      quietHours: { ...config.notifications.quietHours, enabled: checked }
                    })}
                  />
                  <Label>Enable Quiet Hours</Label>
                </div>
                
                {config.notifications.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 ml-8">
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={config.notifications.quietHours.startTime}
                        onChange={(e) => updateConfig('notifications', {
                          quietHours: { ...config.notifications.quietHours, startTime: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={config.notifications.quietHours.endTime}
                        onChange={(e) => updateConfig('notifications', {
                          quietHours: { ...config.notifications.quietHours, endTime: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Behavioral Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Counseling Heat Score Threshold</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={config.thresholds.counselingHeatScore}
                    onChange={(e) => updateConfig('thresholds', { counselingHeatScore: parseFloat(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Heat score that triggers counseling flag
                  </p>
                </div>

                <div>
                  <Label>Critical Heat Score Threshold</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={config.thresholds.criticalHeatScore}
                    onChange={(e) => updateConfig('thresholds', { criticalHeatScore: parseFloat(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Heat score that requires immediate intervention
                  </p>
                </div>

                <div>
                  <Label>Parent Notification Threshold</Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.thresholds.parentNotificationThreshold}
                    onChange={(e) => updateConfig('thresholds', { parentNotificationThreshold: parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Number of incidents before parent notification
                  </p>
                </div>

                <div>
                  <Label>Max Incidents Per Week</Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.thresholds.maxIncidentsPerWeek}
                    onChange={(e) => updateConfig('thresholds', { maxIncidentsPerWeek: parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Weekly incident limit before escalation
                  </p>
                </div>

                <div>
                  <Label>Intervention Trigger (Days)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.thresholds.interventionTriggerDays}
                    onChange={(e) => updateConfig('thresholds', { interventionTriggerDays: parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Days before intervention is recommended
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Automation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Parent Notification</Label>
                    <p className="text-sm text-gray-600">Automatically notify parents when thresholds are reached</p>
                  </div>
                  <Switch
                    checked={config.automation.autoParentNotification}
                    onCheckedChange={(checked) => updateConfig('automation', { autoParentNotification: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Escalation</Label>
                    <p className="text-sm text-gray-600">Automatically escalate critical cases</p>
                  </div>
                  <Switch
                    checked={config.automation.autoEscalation}
                    onCheckedChange={(checked) => updateConfig('automation', { autoEscalation: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Report Generation</Label>
                    <p className="text-sm text-gray-600">Generate reports automatically on schedule</p>
                  </div>
                  <Switch
                    checked={config.automation.autoReportGeneration}
                    onCheckedChange={(checked) => updateConfig('automation', { autoReportGeneration: checked })}
                  />
                </div>

                <div>
                  <Label>Escalation Delay (Hours)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.automation.escalationDelayHours}
                    onChange={(e) => updateConfig('automation', { escalationDelayHours: parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Hours to wait before automatic escalation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Session Timeout (Minutes)</Label>
                  <Input
                    type="number"
                    min="5"
                    value={config.security.sessionTimeout}
                    onChange={(e) => updateConfig('security', { sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Password Expiry (Days)</Label>
                  <Input
                    type="number"
                    min="30"
                    value={config.security.passwordExpiry}
                    onChange={(e) => updateConfig('security', { passwordExpiry: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    min="3"
                    max="10"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => updateConfig('security', { maxLoginAttempts: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Require 2FA for admin users</p>
                  </div>
                  <Switch
                    checked={config.security.twoFactorRequired}
                    onCheckedChange={(checked) => updateConfig('security', { twoFactorRequired: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">Enable maintenance mode for system updates</p>
                  </div>
                  <Switch
                    checked={config.system.maintenanceMode}
                    onCheckedChange={(checked) => updateConfig('system', { maintenanceMode: checked })}
                  />
                </div>

                <div>
                  <Label>Backup Frequency</Label>
                  <Select 
                    value={config.system.backupFrequency} 
                    onValueChange={(value: any) => updateConfig('system', { backupFrequency: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Log Retention (Days)</Label>
                  <Input
                    type="number"
                    min="30"
                    value={config.system.logRetentionDays}
                    onChange={(e) => updateConfig('system', { logRetentionDays: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Cache Expiry (Hours)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.system.cacheExpiryHours}
                    onChange={(e) => updateConfig('system', { cacheExpiryHours: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfiguration;
