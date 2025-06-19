
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  Award,
  Settings,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPreferences {
  email_incidents: boolean;
  email_merits: boolean;
  sms_incidents: boolean;
  sms_merits: boolean;
  push_incidents: boolean;
  push_merits: boolean;
  shadow_child_incidents: boolean;
  shadow_child_merits: boolean;
  counseling_alerts: boolean;
  digest_frequency: 'immediate' | 'daily' | 'weekly' | 'never';
}

const ParentNotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_incidents: true,
    email_merits: true,
    sms_incidents: false,
    sms_merits: false,
    push_incidents: true,
    push_merits: true,
    shadow_child_incidents: true,
    shadow_child_merits: true,
    counseling_alerts: true,
    digest_frequency: 'daily'
  });

  // Load current preferences
  const { data: currentPreferences, isLoading } = useQuery({
    queryKey: ['notification-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data?.notification_preferences;
    },
    enabled: !!user?.id,
  });

  // Update preferences when data loads
  useEffect(() => {
    if (currentPreferences && typeof currentPreferences === 'object') {
      setPreferences(prev => ({ ...prev, ...(currentPreferences as Partial<NotificationPreferences>) }));
    }
  }, [currentPreferences]);

  // Save preferences
  const savePreferences = useMutation({
    mutationFn: async (newPreferences: NotificationPreferences) => {
      if (!user?.id) throw new Error('No user ID');
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          notification_preferences: newPreferences as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      toast.success('Notification preferences saved successfully');
    },
    onError: (error) => {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save notification preferences');
    }
  });

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    savePreferences.mutate(preferences);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Settings className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading preferences...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <p className="text-sm text-gray-600">
            Control what notifications you receive about your child's behavior and academic progress.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Disciplinary Notifications */}
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Disciplinary Incidents
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="email-incidents">Email notifications for incidents</Label>
                </div>
                <Switch
                  id="email-incidents"
                  checked={preferences.email_incidents}
                  onCheckedChange={(checked) => handlePreferenceChange('email_incidents', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="sms-incidents">SMS notifications for incidents</Label>
                </div>
                <Switch
                  id="sms-incidents"
                  checked={preferences.sms_incidents}
                  onCheckedChange={(checked) => handlePreferenceChange('sms_incidents', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="push-incidents">Push notifications for incidents</Label>
                </div>
                <Switch
                  id="push-incidents"
                  checked={preferences.push_incidents}
                  onCheckedChange={(checked) => handlePreferenceChange('push_incidents', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Merit Notifications */}
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-green-600" />
              Merit Awards
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="email-merits">Email notifications for merits</Label>
                </div>
                <Switch
                  id="email-merits"
                  checked={preferences.email_merits}
                  onCheckedChange={(checked) => handlePreferenceChange('email_merits', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="sms-merits">SMS notifications for merits</Label>
                </div>
                <Switch
                  id="sms-merits"
                  checked={preferences.sms_merits}
                  onCheckedChange={(checked) => handlePreferenceChange('sms_merits', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="push-merits">Push notifications for merits</Label>
                </div>
                <Switch
                  id="push-merits"
                  checked={preferences.push_merits}
                  onCheckedChange={(checked) => handlePreferenceChange('push_merits', checked)}
                />
              </div>
            </div>
          </div>

          {/* Shadow Parent Role Notifications (if applicable) */}
          {user?.role === 'shadow_parent' && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                  <Bell className="h-5 w-5 text-pink-600" />
                  Shadow Child Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shadow-incidents">Notify about shadow child incidents</Label>
                    <Switch
                      id="shadow-incidents"
                      checked={preferences.shadow_child_incidents}
                      onCheckedChange={(checked) => handlePreferenceChange('shadow_child_incidents', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shadow-merits">Notify about shadow child merits</Label>
                    <Switch
                      id="shadow-merits"
                      checked={preferences.shadow_child_merits}
                      onCheckedChange={(checked) => handlePreferenceChange('shadow_child_merits', checked)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Counseling Alerts */}
          <div>
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Counseling & Intervention Alerts
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="counseling-alerts">Counseling alerts and recommendations</Label>
                <p className="text-sm text-gray-600">
                  Get notified when your child is flagged for counseling or intervention
                </p>
              </div>
              <Switch
                id="counseling-alerts"
                checked={preferences.counseling_alerts}
                onCheckedChange={(checked) => handlePreferenceChange('counseling_alerts', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Digest Frequency */}
          <div>
            <h3 className="text-lg font-medium mb-4">Summary Reports</h3>
            <div>
              <Label htmlFor="digest-frequency">Report frequency</Label>
              <select
                id="digest-frequency"
                value={preferences.digest_frequency}
                onChange={(e) => handlePreferenceChange('digest_frequency', e.target.value)}
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="immediate">Immediate (as they happen)</option>
                <option value="daily">Daily summary</option>
                <option value="weekly">Weekly summary</option>
                <option value="never">Never send summaries</option>
              </select>
              <p className="text-sm text-gray-600 mt-1">
                How often you want to receive summary reports about your child's behavior
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave}
              disabled={savePreferences.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {savePreferences.isPending ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">About Notifications</h4>
              <div className="text-sm text-blue-800 mt-1 space-y-1">
                <p>• You can change these preferences at any time</p>
                <p>• Critical incidents will always generate notifications regardless of settings</p>
                <p>• Shadow parent notifications are separate from parent notifications</p>
                <p>• All notifications are also available in your notification center</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentNotificationSettings;
