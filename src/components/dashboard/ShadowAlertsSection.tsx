
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  AlertTriangle, 
  Award, 
  Eye,
  Bell,
  Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ShadowAlert {
  id: string;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  reference_id: string;
  student_name?: string;
  behavior_type?: string;
}

const ShadowAlertsSection: React.FC = () => {
  const { user } = useAuth();

  // Get shadow child notifications for the current teacher
  const { data: shadowAlerts = [] } = useQuery({
    queryKey: ['shadow_alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .in('type', ['shadow_child_incident', 'shadow_child_merit'])
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as ShadowAlert[];
    },
    enabled: !!user?.id,
  });

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  };

  const unreadCount = shadowAlerts.filter(alert => !alert.is_read).length;

  const getAlertIcon = (type: string) => {
    if (type === 'shadow_child_incident') {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
    return <Award className="h-4 w-4 text-green-600" />;
  };

  const getAlertColor = (type: string) => {
    if (type === 'shadow_child_incident') {
      return 'border-red-200 bg-red-50';
    }
    return 'border-green-200 bg-green-50';
  };

  return (
    <Card className="border-pink-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <span>Shadow Alerts</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-1" />
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {shadowAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Shadow Alerts</h3>
            <p>You'll see notifications here when your shadow children have behavior updates.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {shadowAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                  !alert.is_read ? 'ring-2 ring-pink-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={alert.type === 'shadow_child_incident' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.type === 'shadow_child_incident' ? 'INCIDENT' : 'MERIT'}
                        </Badge>
                        {!alert.is_read && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(alert.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!alert.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(alert.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShadowAlertsSection;
