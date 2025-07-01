
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'incident' | 'merit' | 'meeting' | 'announcement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  priority?: 'low' | 'medium' | 'high';
  relatedId?: string;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Mock notifications based on user role
  useEffect(() => {
    if (!user) return;

    const mockNotifications: Notification[] = [];

    if (user.role === 'parent') {
      mockNotifications.push(
        {
          id: '1',
          type: 'incident',
          title: 'Disciplinary Incident',
          message: 'Your child Sarah has been involved in a minor classroom disruption. Please review the details.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          actionable: true,
          priority: 'high'
        },
        {
          id: '2',
          type: 'merit',
          title: 'Merit Points Awarded',
          message: 'Sarah has been awarded 5 merit points for excellent academic performance!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          priority: 'medium'
        },
        {
          id: '3',
          type: 'meeting',
          title: 'Meeting Confirmation',
          message: 'Your parent-teacher meeting with Mrs. Johnson has been confirmed for March 15th at 2:00 PM.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
          priority: 'medium'
        },
        {
          id: '4',
          type: 'announcement',
          title: 'School Event',
          message: 'Don\'t forget about Sports Day on March 25th! Registration closes this Friday.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
          read: false,
          priority: 'low'
        }
      );
    } else if (user.role === 'teacher') {
      mockNotifications.push(
        {
          id: '1',
          type: 'warning',
          title: 'Student at Risk',
          message: 'John Smith has reached a heat score of 8.5 and requires attention.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          actionable: true,
          priority: 'high'
        },
        {
          id: '2',
          type: 'info',
          title: 'Shadow Child Update',
          message: 'Your shadow child Emily has shown improvement in behavior this week.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          priority: 'medium'
        },
        {
          id: '3',
          type: 'success',
          title: 'Report Generated',
          message: 'Monthly behavior report has been successfully generated.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
          priority: 'low'
        }
      );
    }

    setNotifications(mockNotifications);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: 'All notifications marked as read',
      description: 'Your notifications have been updated.'
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: 'Notification removed',
      description: 'The notification has been deleted.'
    });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
      case 'merit':
        return <Award className="h-4 w-4 text-green-600" />;
      case 'warning':
      case 'incident':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'meeting':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'announcement':
        return <Bell className="h-4 w-4 text-purple-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority?: string) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50';
    
    switch (type) {
      case 'success':
      case 'merit':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
      case 'incident':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'meeting':
        return 'border-l-blue-500 bg-blue-50';
      case 'announcement':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionable) {
      toast({
        title: 'Action triggered',
        description: `Handling ${notification.type} notification`,
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with system alerts and activities
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-3 pr-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">No notifications</h3>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((notification) => (
                  <Card
                    key={notification.id}
                    className={`border-l-4 transition-all ${getNotificationColor(notification.type, notification.priority)} ${
                      !notification.read ? 'shadow-sm ring-1 ring-blue-100' : 'opacity-75'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {notification.title}
                              </h4>
                              {notification.priority === 'high' && (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  High
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {notification.actionable && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs px-2"
                                  onClick={() => handleNotificationAction(notification)}
                                >
                                  Take Action
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
