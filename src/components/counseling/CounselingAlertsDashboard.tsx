import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useCounselingAlerts, useUnresolvedCounselingAlerts, useResolveCounselingAlert } from '@/hooks/useCounselingAlerts';
import { 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  User,
  Brain,
  TrendingUp,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const CounselingAlertsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: allAlerts = [] } = useCounselingAlerts();
  const { data: unresolvedAlerts = [] } = useUnresolvedCounselingAlerts();
  const resolveAlert = useResolveCounselingAlert();

  const handleResolveAlert = async (alertId: string) => {
    if (!user?.id) return;
    
    try {
      await resolveAlert.mutateAsync({
        alertId,
        resolvedBy: user.id
      });
      toast.success('Alert resolved successfully');
    } catch (error) {
      toast.error('Failed to resolve alert');
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'low': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const criticalAlerts = unresolvedAlerts.filter(alert => alert.severity_level === 'critical');
  const highAlerts = unresolvedAlerts.filter(alert => alert.severity_level === 'high');
  const resolvedToday = allAlerts.filter(alert => 
    alert.is_resolved && 
    alert.resolved_at && 
    new Date(alert.resolved_at).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Brain className="h-6 w-6" />
            Counseling Alerts Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
              <div className="text-sm text-gray-600">Critical Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{highAlerts.length}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unresolvedAlerts.length}</div>
              <div className="text-sm text-gray-600">Total Unresolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{resolvedToday.length}</div>
              <div className="text-sm text-gray-600">Resolved Today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="unresolved" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="unresolved">Unresolved Alerts</TabsTrigger>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="unresolved" className="space-y-6">
          {/* Critical Alerts Section */}
          {criticalAlerts.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Alerts - Immediate Attention Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-white border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getSeverityIcon(alert.severity_level)}
                          <div>
                            <div className="font-medium text-red-800">
                              {alert.student?.name} - {alert.student?.grade}
                            </div>
                            <div className="text-sm text-red-600">{alert.alert_type.replace('_', ' ').toUpperCase()}</div>
                          </div>
                        </div>
                        <Badge className={getSeverityColor(alert.severity_level)}>
                          {alert.severity_level.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Created: {format(new Date(alert.created_at!), 'MMM dd, yyyy HH:mm')}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleResolveAlert(alert.id)}
                            disabled={resolveAlert.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Resolved
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Session
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other Unresolved Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Other Unresolved Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unresolvedAlerts.filter(alert => alert.severity_level !== 'critical').map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(alert.severity_level)}
                        <div>
                          <div className="font-medium">
                            {alert.student?.name} - {alert.student?.grade}
                          </div>
                          <div className="text-sm text-gray-600">{alert.alert_type.replace('_', ' ').toUpperCase()}</div>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(alert.severity_level)}>
                        {alert.severity_level.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Created: {format(new Date(alert.created_at!), 'MMM dd, yyyy HH:mm')}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResolveAlert(alert.id)}
                          disabled={resolveAlert.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline">
                          <User className="h-4 w-4 mr-2" />
                          Contact Student
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {unresolvedAlerts.filter(alert => alert.severity_level !== 'critical').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">All Non-Critical Alerts Resolved</h3>
                  <p>Great work! All non-critical counseling alerts have been addressed.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {unresolvedAlerts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Unresolved Alerts</h3>
                <p className="text-gray-500">
                  Excellent! All counseling alerts have been addressed. Keep up the great work!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Counseling Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${alert.is_resolved ? 'bg-gray-50' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {alert.is_resolved ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          getSeverityIcon(alert.severity_level)
                        )}
                        <div>
                          <div className="font-medium">
                            {alert.student?.name} - {alert.student?.grade}
                          </div>
                          <div className="text-sm text-gray-600">{alert.alert_type.replace('_', ' ').toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getSeverityColor(alert.severity_level)}>
                          {alert.severity_level.toUpperCase()}
                        </Badge>
                        {alert.is_resolved && (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                    <div className="text-xs text-gray-500">
                      Created: {format(new Date(alert.created_at!), 'MMM dd, yyyy HH:mm')}
                      {alert.resolved_at && (
                        <span className="ml-4">
                          Resolved: {format(new Date(alert.resolved_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Resolved Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allAlerts.filter(alert => alert.is_resolved).map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">
                            {alert.student?.name} - {alert.student?.grade}
                          </div>
                          <div className="text-sm text-gray-600">{alert.alert_type.replace('_', ' ').toUpperCase()}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Resolved
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                    <div className="text-xs text-gray-500">
                      Resolved: {format(new Date(alert.resolved_at!), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CounselingAlertsDashboard;
