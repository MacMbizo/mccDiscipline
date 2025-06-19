
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = "" }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    incidentAlerts: true,
    meritAwards: true,
    systemUpdates: false,
    reportGeneration: true,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '06:00',
    alertFrequency: 'immediate'
  });

  const { toast } = useToast();

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    console.log('Saving notification settings:', settings);
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Methods</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via text message</p>
              </div>
              <Switch
                id="sms-notifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive in-app notifications</p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Types</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="incident-alerts">Incident Alerts</Label>
                <p className="text-sm text-gray-600">New incidents and behavior updates</p>
              </div>
              <Switch
                id="incident-alerts"
                checked={settings.incidentAlerts}
                onCheckedChange={(checked) => handleSettingChange('incidentAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="merit-awards">Merit Awards</Label>
                <p className="text-sm text-gray-600">Merit points and positive behavior</p>
              </div>
              <Switch
                id="merit-awards"
                checked={settings.meritAwards}
                onCheckedChange={(checked) => handleSettingChange('meritAwards', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-updates">System Updates</Label>
                <p className="text-sm text-gray-600">System maintenance and feature updates</p>
              </div>
              <Switch
                id="system-updates"
                checked={settings.systemUpdates}
                onCheckedChange={(checked) => handleSettingChange('systemUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="report-generation">Report Generation</Label>
                <p className="text-sm text-gray-600">Report completion notifications</p>
              </div>
              <Switch
                id="report-generation"
                checked={settings.reportGeneration}
                onCheckedChange={(checked) => handleSettingChange('reportGeneration', checked)}
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Advanced Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quiet-hours">Quiet Hours</Label>
                <p className="text-sm text-gray-600">Don't send notifications during specified hours</p>
              </div>
              <Switch
                id="quiet-hours"
                checked={settings.quietHoursEnabled}
                onCheckedChange={(checked) => handleSettingChange('quietHoursEnabled', checked)}
              />
            </div>

            {settings.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div>
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Select value={settings.quietHoursStart} onValueChange={(value) => handleSettingChange('quietHoursStart', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Select value={settings.quietHoursEnd} onValueChange={(value) => handleSettingChange('quietHoursEnd', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="alert-frequency">Alert Frequency</Label>
              <Select value={settings.alertFrequency} onValueChange={(value) => handleSettingChange('alertFrequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveSettings}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
