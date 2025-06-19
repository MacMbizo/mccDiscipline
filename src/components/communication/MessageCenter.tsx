
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  MessageSquare, 
  Users, 
  Calendar,
  Phone,
  Video,
  Bell,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  senderRole: string;
  recipient: string;
  recipientRole: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  priority: 'low' | 'medium' | 'high';
  type: 'general' | 'incident' | 'meeting' | 'announcement';
}

interface MessageCenterProps {
  userRole: string;
  userId: string;
  className?: string;
}

const MessageCenter: React.FC<MessageCenterProps> = ({
  userRole,
  userId,
  className = ""
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'medium' as const,
    type: 'general' as const
  });

  // Mock messages data
  const [messages] = useState<Message[]>([
    {
      id: '1',
      subject: 'Student Behavior Concern - John Smith',
      content: 'I wanted to discuss John\'s recent behavior incidents and potential intervention strategies.',
      sender: 'Mr. Johnson',
      senderRole: 'teacher',
      recipient: 'Mrs. Smith',
      recipientRole: 'parent',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'read',
      priority: 'high',
      type: 'incident'
    },
    {
      id: '2',
      subject: 'Merit Award Notification',
      content: 'Congratulations! Your child has been awarded a Gold merit for excellent participation in class.',
      sender: 'Ms. Davis',
      senderRole: 'teacher',
      recipient: 'Mr. Chen',
      recipientRole: 'parent',
      timestamp: '2024-01-14T14:15:00Z',
      status: 'delivered',
      priority: 'medium',
      type: 'general'
    },
    {
      id: '3',
      subject: 'Parent-Teacher Conference Request',
      content: 'I would like to schedule a meeting to discuss Sarah\'s academic progress and behavior.',
      sender: 'Mrs. Wilson',
      senderRole: 'parent',
      recipient: 'Mr. Roberts',
      recipientRole: 'teacher',
      timestamp: '2024-01-13T09:45:00Z',
      status: 'sent',
      priority: 'medium',
      type: 'meeting'
    }
  ]);

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the message to your backend
    console.log('Sending message:', newMessage);

    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully!",
    });

    setNewMessage({
      recipient: '',
      subject: '',
      content: '',
      priority: 'medium',
      type: 'general'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'incident': return '⚠️';
      case 'meeting': return '📅';
      case 'announcement': return '📢';
      default: return '💬';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages List */}
              <div className="space-y-3">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getTypeIcon(message.type)}</span>
                        <div>
                          <h4 className="font-medium text-gray-800">{message.subject}</h4>
                          <p className="text-sm text-gray-600">
                            From: {message.sender} ({message.senderRole})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.timestamp), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {message.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {message.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Reply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compose" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Recipient</label>
                  <Input
                    placeholder="Search for teacher, parent, or admin..."
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newMessage.priority}
                      onChange={(e) => setNewMessage({ ...newMessage, priority: e.target.value as any })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newMessage.type}
                      onChange={(e) => setNewMessage({ ...newMessage, type: e.target.value as any })}
                    >
                      <option value="general">General</option>
                      <option value="incident">Incident Related</option>
                      <option value="meeting">Meeting Request</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="Message subject..."
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    rows={6}
                  />
                </div>

                <Button onClick={handleSendMessage} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="meetings" className="space-y-4">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium text-gray-800 mb-2">Meeting Scheduler</h3>
                <p className="text-gray-600 mb-4">Schedule meetings with teachers, parents, or administrators</p>
                
                <div className="space-y-3 max-w-sm mx-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Video className="h-4 w-4 mr-2" />
                    Schedule Video Call
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Phone Call
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    In-Person Meeting
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageCenter;
