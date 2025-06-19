
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Heart, 
  AlertTriangle, 
  Award,
  GraduationCap,
  Home,
  Phone,
  Mail
} from 'lucide-react';
import { Student } from '@/hooks/useStudents';
import HeatBar from '@/components/common/HeatBar';

interface StudentProfileCardProps {
  student: Student & {
    shadow_parent?: { name: string; id: string } | null;
    recent_incidents?: number;
    recent_merits?: number;
  };
  onEdit?: () => void;
  onViewRecords?: () => void;
  showShadowParent?: boolean;
}

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  student,
  onEdit,
  onViewRecords,
  showShadowParent = true
}) => {
  return (
    <Card className={student.needs_counseling ? 'border-orange-300 bg-orange-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{student.name}</h3>
              <p className="text-sm text-gray-600">ID: {student.student_id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {student.needs_counseling && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Needs Counseling
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{student.grade}</span>
          </div>
          {student.gender && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm capitalize">{student.gender}</span>
            </div>
          )}
          {student.boarding_status && (
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {student.boarding_status === 'boarder' ? 'Boarder' : 'Day Scholar'}
              </span>
            </div>
          )}
          <div className="text-sm">
            <span className="font-medium">Score: </span>
            <span className={
              (student.behavior_score || 0) <= 3 ? 'text-green-600' :
              (student.behavior_score || 0) <= 5 ? 'text-blue-600' :
              (student.behavior_score || 0) <= 7 ? 'text-yellow-600' :
              'text-red-600'
            }>
              {student.behavior_score?.toFixed(1) || '0.0'}
            </span>
          </div>
        </div>

        {/* Shadow Parent Info */}
        {showShadowParent && (
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-800">Shadow Parent</span>
            </div>
            {student.shadow_parent ? (
              <p className="text-sm text-pink-700">{student.shadow_parent.name}</p>
            ) : (
              <p className="text-sm text-pink-600 italic">Not assigned</p>
            )}
          </div>
        )}

        {/* Heat Bar */}
        <div>
          <h4 className="text-sm font-medium mb-2">Behavior Score</h4>
          <HeatBar score={student.behavior_score || 0} size="sm" />
        </div>

        {/* Recent Activity */}
        {(student.recent_incidents !== undefined || student.recent_merits !== undefined) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="text-lg font-bold text-red-600">
                {student.recent_incidents || 0}
              </div>
              <div className="text-xs text-red-600">Recent Incidents</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">
                {student.recent_merits || 0}
              </div>
              <div className="text-xs text-green-600">Recent Merits</div>
            </div>
          </div>
        )}

        {/* Counseling Alert */}
        {student.needs_counseling && (
          <div className="p-3 bg-orange-100 border border-orange-300 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Counseling Required</span>
            </div>
            <p className="text-xs text-orange-700">
              {student.counseling_reason || 'Student has been flagged for counseling intervention.'}
            </p>
            {student.counseling_flagged_at && (
              <p className="text-xs text-orange-600 mt-1">
                Flagged: {new Date(student.counseling_flagged_at).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Parent Contacts */}
        {student.parent_contacts && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h5 className="text-sm font-medium text-gray-800 mb-2">Parent Contacts</h5>
            <div className="space-y-1 text-xs text-gray-600">
              {typeof student.parent_contacts === 'object' && student.parent_contacts !== null && (
                Object.entries(student.parent_contacts as Record<string, any>).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    {key.toLowerCase().includes('phone') ? (
                      <Phone className="h-3 w-3" />
                    ) : key.toLowerCase().includes('email') ? (
                      <Mail className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    <span className="capitalize">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(onEdit || onViewRecords) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onViewRecords && (
              <Button size="sm" variant="outline" onClick={onViewRecords}>
                View Records
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;
