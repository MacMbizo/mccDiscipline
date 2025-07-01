
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Bell, 
  Calendar, 
  AlertTriangle, 
  Info, 
  Award,
  BookOpen,
  Users,
  Megaphone
} from 'lucide-react';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'academic' | 'event' | 'urgent' | 'achievement';
  date: Date;
  author: string;
  priority: 'low' | 'medium' | 'high';
  readBy?: string[];
}

const SchoolAnnouncements: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Mock data - in a real app, this would come from your backend
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Parent-Teacher Conference Week',
      content: 'Dear parents, we are pleased to announce that Parent-Teacher Conference Week will be held from March 15-19, 2024. Please schedule your appointments through the parent portal or contact the school office directly.',
      type: 'event',
      date: new Date('2024-03-10'),
      author: 'Principal Johnson',
      priority: 'high'
    },
    {
      id: '2',
      title: 'New Merit System Implementation',
      content: 'We are excited to introduce our enhanced merit point system starting this month. Students can earn points through academic excellence, positive behavior, and community service. Points can be redeemed for various rewards.',
      type: 'academic',
      date: new Date('2024-03-08'),
      author: 'Academic Affairs',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'School Sports Day 2024',
      content: 'Join us for our annual Sports Day on March 25th! Students will participate in various athletic events. Parents are warmly invited to attend and cheer for their children.',
      type: 'event',
      date: new Date('2024-03-05'),
      author: 'Sports Department',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Updated School Safety Protocols',
      content: 'Important updates to our school safety protocols have been implemented. Please review the attached guidelines and discuss them with your children.',
      type: 'urgent',
      date: new Date('2024-03-02'),
      author: 'Safety Committee',
      priority: 'high'
    },
    {
      id: '5',
      title: 'Student Achievement Recognition',
      content: 'Congratulations to our students who excelled in the recent academic competitions! We are proud to announce that Sarah Johnson won first place in the Mathematics Olympiad.',
      type: 'achievement',
      date: new Date('2024-02-28'),
      author: 'Academic Department',
      priority: 'low'
    }
  ];

  const getAnnouncementIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'academic':
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Bell className="h-6 w-6" />
            View School Announcements
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              School Announcements
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getAnnouncementIcon(announcement.type)}
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {format(announcement.date, 'MMM dd')}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-500">
                        By {announcement.author}
                      </span>
                      <Button variant="ghost" size="sm">
                        Read More →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Detailed Announcement Modal */}
      <Dialog 
        open={!!selectedAnnouncement} 
        onOpenChange={() => setSelectedAnnouncement(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedAnnouncement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getAnnouncementIcon(selectedAnnouncement.type)}
                  {selectedAnnouncement.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getPriorityColor(selectedAnnouncement.priority)}>
                    {selectedAnnouncement.priority} priority
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {format(selectedAnnouncement.date, 'PPP')}
                  </span>
                </div>
                
                <div className="prose max-w-none">
                  <p>{selectedAnnouncement.content}</p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Published by <strong>{selectedAnnouncement.author}</strong>
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SchoolAnnouncements;
