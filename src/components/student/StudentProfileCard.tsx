
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
  Mail,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Student } from '@/hooks/useStudents';
import HeatBar from '@/components/common/HeatBar';

interface StudentProfileCardProps {
  student: Student & {
    shadow_parent?: { name: string; id: string } | null;
    recent_incidents?: number;
    recent_merits?: number;
    is_shadow_child?: boolean;
  };
  onEdit?: () => void;
  onViewRecords?: () => void;
  onViewDetails?: () => void;
  showShadowParent?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'shadow' | 'compact';
}

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  student,
  onEdit,
  onViewRecords,
  onViewDetails,
  showShadowParent = true,
  showActions = true,
  variant = 'default'
}) => {
  const isCompact = variant === 'compact';
  const isShadowVariant = variant === 'shadow' || student.is_shadow_child;

  return (
    <Card className={`
      ${student.needs_counseling ? 'border-orange-300 bg-orange-50' : ''}
      ${isShadowVariant ? 'border-pink-200 bg-pink-50' : ''}
      ${isCompact ? 'shadow-sm' : 'shadow-md'}
      transition-all duration-200 hover:shadow-lg
    `}>
      <CardHeader className={isCompact ? 'pb-2' : ''}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              ${isCompact ? 'h-8 w-8' : 'h-10 w-10'} 
              ${isShadowVariant ? 'bg-pink-100' : 'bg-blue-100'} 
              rounded-full flex items-center justify-center
            `}>
              {isShadowVariant ? (
                <Heart className={`${isCompact ? 'h-4 w-4' : 'h-6 w-6'} text-pink-600`} />
              ) : (
                <User className={`${isCompact ? 'h-4 w-4' : 'h-6 w-6'} text-blue-600`} />
              )}
            </div>
            <div>
              <h3 className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold`}>
                {student.name}
                {isShadowVariant && (
                  <Heart className="inline-block h-4 w-4 text-pink-500 ml-2" />
                )}
              </h3>
              <p className="text-sm text-gray-600">ID: {student.student_id}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {student.needs_counseling && (
              <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                Needs Counseling
              </Badge>
            )}
            {isShadowVariant && (
              <Badge className="bg-pink-100 text-pink-800 text-xs">
                Shadow Child
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info Grid */}
        <div className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
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
              (student.behavior_score || 0) <= 3 ? 'text-green-600 font-semibold' :
              (student.behavior_score || 0) <= 5 ? 'text-blue-600 font-semibold' :
              (student.behavior_score || 0) <= 7 ? 'text-yellow-600 font-semibold' :
              'text-red-600 font-semibold'
            }>
              {student.behavior_score?.toFixed(1) || '0.0'}
            </span>
          </div>
        </div>

        {/* Shadow Parent Info - Enhanced */}
        {showShadowParent && (
          <div className={`p-3 ${isShadowVariant ? 'bg-pink-100 border-pink-200' : 'bg-pink-50 border-pink-200'} border rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-800">Shadow Parent</span>
            </div>
            {student.shadow_parent ? (
              <div className="flex items-center justify-between">
                <p className="text-sm text-pink-700 font-medium">{student.shadow_parent.name}</p>
                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-300">
                  Active Assignment
                </Badge>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-pink-600 italic">Not assigned</p>
                <Badge variant="outline" className="bg-gray-50 text-gray-600">
                  Available
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Heat Bar - Enhanced */}
        {!isCompact && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Behavior Score</h4>
              <Badge variant="outline" className={
                (student.behavior_score || 0) <= 3 ? 'bg-green-50 text-green-700 border-green-200' :
                (student.behavior_score || 0) <= 5 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                (student.behavior_score || 0) <= 7 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-red-50 text-red-700 border-red-200'
              }>
                {(student.behavior_score || 0) <= 3 ? 'Excellent' :
                 (student.behavior_score || 0) <= 5 ? 'Good' :
                 (student.behavior_score || 0) <= 7 ? 'Warning' : 'Critical'}
              </Badge>
            </div>
            <HeatBar score={student.behavior_score || 0} size="sm" />
          </div>
        )}

        {/* Recent Activity - Enhanced */}
        {(student.recent_incidents !== undefined || student.recent_merits !== undefined) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
              <div className="text-xl font-bold text-red-600">
                {student.recent_incidents || 0}
              </div>
              <div className="text-xs text-red-600 font-medium">Recent Incidents</div>
              {(student.recent_incidents || 0) > 0 && (
                <div className="text-xs text-red-500 mt-1">Last 30 days</div>
              )}
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-xl font-bold text-green-600">
                {student.recent_merits || 0}
              </div>
              <div className="text-xs text-green-600 font-medium">Recent Merits</div>
              {(student.recent_merits || 0) > 0 && (
                <div className="text-xs text-green-500 mt-1">Last 30 days</div>
              )}
            </div>
          </div>
        )}

        {/* Counseling Alert - Enhanced */}
        {student.needs_counseling && (
          <div className="p-3 bg-orange-100 border border-orange-300 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Counseling Required</span>
              <Badge variant="destructive" className="text-xs">Urgent</Badge>
            </div>
            <p className="text-xs text-orange-700 mb-2">
              {student.counseling_reason || 'Student has been flagged for counseling intervention.'}
            </p>
            {student.counseling_flagged_at && (
              <p className="text-xs text-orange-600">
                Flagged: {new Date(student.counseling_flagged_at).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Parent Contacts - Compact for mobile */}
        {student.parent_contacts && !isCompact && (
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
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        {showActions && (onEdit || onViewRecords || onViewDetails) && (
          <div className="flex gap-2 pt-2">
            {onViewDetails && (
              <Button size="sm" variant="outline" onClick={onViewDetails} className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            )}
            {onViewRecords && (
              <Button size="sm" variant="outline" onClick={onViewRecords} className="flex-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                Records
              </Button>
            )}
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                Edit
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;
