
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import HeatBar from '@/components/common/HeatBar';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';

const RecentActivityCard: React.FC = () => {
  const { data: records, isLoading } = useBehaviorRecords();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-mcc-blue">Loading recent activity...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records?.slice(0, 5).map((record) => (
            <div 
              key={record.id}
              className={`flex items-center justify-between p-3 rounded border-l-4 ${
                record.type === 'incident' 
                  ? 'bg-red-50 border-mcc-red' 
                  : 'bg-green-50 border-mcc-green'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {record.type === 'incident' ? (
                    <AlertTriangle className="h-4 w-4 text-mcc-red" />
                  ) : (
                    <Award className="h-4 w-4 text-mcc-green" />
                  )}
                  <p className="font-medium">
                    {(record as any).student?.name} - {record.description}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {record.type === 'incident' 
                    ? `${record.location} • ${record.offense_number}${
                        record.offense_number === 1 ? 'st' :
                        record.offense_number === 2 ? 'nd' :
                        record.offense_number === 3 ? 'rd' : 'th'
                      } Offense • ${record.sanction}`
                    : `${record.merit_tier} • ${record.points} points awarded`
                  }
                </p>
                <div className="mt-2">
                  {(record as any).student?.behavior_score && (
                    <HeatBar 
                      score={(record as any).student.behavior_score} 
                      size="sm" 
                      showTrend={false} 
                    />
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">
                  {new Date(record.timestamp || '').toLocaleDateString()}
                </span>
                {record.type === 'incident' && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      {record.status}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              No recent activity found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
