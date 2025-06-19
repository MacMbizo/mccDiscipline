
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Award, 
  Search, 
  BarChart3,
  Plus,
  Users,
  FileText,
  Bell
} from 'lucide-react';
import IncidentForm from '@/components/forms/IncidentForm';
import MeritForm from '@/components/forms/MeritForm';

interface QuickActionsProps {
  userRole: string;
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole, className = "" }) => {
  const getActionsForRole = () => {
    switch (userRole) {
      case 'admin':
        return [
          { 
            icon: BarChart3, 
            label: 'Analytics', 
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => console.log('Navigate to analytics')
          },
          { 
            icon: Users, 
            label: 'Students', 
            color: 'bg-green-600 hover:bg-green-700',
            action: () => console.log('Navigate to students')
          },
          { 
            icon: FileText, 
            label: 'Reports', 
            color: 'bg-purple-600 hover:bg-purple-700',
            action: () => console.log('Navigate to reports')
          },
          { 
            icon: Bell, 
            label: 'Notifications', 
            color: 'bg-orange-600 hover:bg-orange-700',
            action: () => console.log('Navigate to notifications')
          }
        ];
      
      case 'teacher':
        return [
          { 
            icon: AlertTriangle, 
            label: 'Log Incident', 
            color: 'bg-red-600 hover:bg-red-700',
            dialog: 'incident'
          },
          { 
            icon: Award, 
            label: 'Award Merit', 
            color: 'bg-green-600 hover:bg-green-700',
            dialog: 'merit'
          },
          { 
            icon: Search, 
            label: 'Find Student', 
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => console.log('Open student search')
          },
          { 
            icon: BarChart3, 
            label: 'Class Stats', 
            color: 'bg-purple-600 hover:bg-purple-700',
            action: () => console.log('Navigate to class analytics')
          }
        ];
      
      case 'student':
        return [
          { 
            icon: BarChart3, 
            label: 'My Progress', 
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => console.log('Navigate to progress')
          },
          { 
            icon: Award, 
            label: 'My Merits', 
            color: 'bg-green-600 hover:bg-green-700',
            action: () => console.log('Navigate to merits')
          },
          { 
            icon: FileText, 
            label: 'My Records', 
            color: 'bg-purple-600 hover:bg-purple-700',
            action: () => console.log('Navigate to records')
          },
          { 
            icon: Plus, 
            label: 'Set Goals', 
            color: 'bg-orange-600 hover:bg-orange-700',
            action: () => console.log('Open goal setting')
          }
        ];
      
      case 'parent':
        return [
          { 
            icon: Users, 
            label: 'My Children', 
            color: 'bg-blue-600 hover:bg-blue-700',
            action: () => console.log('Navigate to children')
          },
          { 
            icon: Bell, 
            label: 'Notifications', 
            color: 'bg-orange-600 hover:bg-orange-700',
            action: () => console.log('Navigate to notifications')
          },
          { 
            icon: FileText, 
            label: 'Reports', 
            color: 'bg-purple-600 hover:bg-purple-700',
            action: () => console.log('Navigate to reports')
          },
          { 
            icon: BarChart3, 
            label: 'Progress', 
            color: 'bg-green-600 hover:bg-green-700',
            action: () => console.log('Navigate to progress')
          }
        ];
      
      default:
        return [];
    }
  };

  const actions = getActionsForRole();

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            
            if (action.dialog) {
              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Button
                      className={`h-20 flex-col gap-2 text-white ${action.color}`}
                      size="lg"
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {action.dialog === 'incident' ? 'Log New Incident' : 'Award Merit Points'}
                      </DialogTitle>
                    </DialogHeader>
                    {action.dialog === 'incident' ? <IncidentForm /> : <MeritForm />}
                  </DialogContent>
                </Dialog>
              );
            }

            return (
              <Button
                key={index}
                className={`h-20 flex-col gap-2 text-white ${action.color}`}
                size="lg"
                onClick={action.action}
              >
                <IconComponent className="h-6 w-6" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
