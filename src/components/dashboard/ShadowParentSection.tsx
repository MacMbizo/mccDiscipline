
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Users, TrendingUp, AlertTriangle, Award, Eye } from 'lucide-react';
import { useShadowParentDashboard } from '@/hooks/useShadowParents';
import { useAuth } from '@/contexts/AuthContext';
import HeatBar from '@/components/common/HeatBar';

interface ShadowParentSectionProps {
  className?: string;
}

const ShadowParentSection: React.FC<ShadowParentSectionProps> = ({ className }) => {
  const { user } = useAuth();
  const { data: shadowChildren = [], isLoading } = useShadowParentDashboard(user?.id || '');

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Shadow Children
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading shadow children...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (shadowChildren.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Shadow Children
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Shadow Children Assigned</h3>
            <p className="text-sm text-gray-500">
              You haven't been assigned any shadow children yet. Contact an administrator to get assigned.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAtRisk = shadowChildren.filter(child => child.needs_counseling).length;
  const avgHeatScore = shadowChildren.reduce((sum, child) => sum + (child.behavior_score || 0), 0) / shadowChildren.length;
  const totalRecentIncidents = shadowChildren.reduce((sum, child) => sum + (child.recent_incidents || 0), 0);
  const totalRecentMerits = shadowChildren.reduce((sum, child) => sum + (child.recent_merits || 0), 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Your Shadow Children ({shadowChildren.length}/5)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{shadowChildren.length}</div>
              <div className="text-sm text-blue-600">Assigned Children</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{avgHeatScore.toFixed(1)}</div>
              <div className="text-sm text-yellow-600">Avg Heat Score</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{totalAtRisk}</div>
              <div className="text-sm text-red-600">Need Counseling</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalRecentMerits}</div>
              <div className="text-sm text-green-600">Recent Merits</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Shadow Children */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {shadowChildren.map((child) => (
          <Card key={child.student_id} className={child.needs_counseling ? 'border-orange-300 bg-orange-50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{child.student_name}</h3>
                    <p className="text-sm text-gray-600">{child.grade}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {child.needs_counseling && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Counseling
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {child.boarding_status === 'boarder' ? 'Boarder' : 'Day Scholar'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Heat Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Behavior Score</span>
                  <span className="text-sm text-gray-600">{child.behavior_score?.toFixed(1) || '0.0'}</span>
                </div>
                <HeatBar score={child.behavior_score || 0} size="sm" />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="text-lg font-bold text-red-600">
                    {child.recent_incidents || 0}
                  </div>
                  <div className="text-xs text-red-600">Recent Incidents</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">
                    {child.recent_merits || 0}
                  </div>
                  <div className="text-xs text-green-600">Recent Merits</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      {shadowChildren.length < 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Shadow Parent Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                You can be assigned up to 5 shadow children. Currently assigned: {shadowChildren.length}
              </div>
              <Badge variant="outline">
                {5 - shadowChildren.length} slots available
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShadowParentSection;
