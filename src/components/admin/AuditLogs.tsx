
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Filter, Download, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  details: any;
  ip_address: string;
  created_at: string;
  profiles?: {
    name: string;
    role: string;
  };
}

const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ['audit_logs', searchTerm, selectedAction, selectedUser],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:profiles(name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,details->>'description'.ilike.%${searchTerm}%`);
      }

      if (selectedAction !== 'all') {
        query = query.ilike('action', `%${selectedAction}%`);
      }

      if (selectedUser !== 'all') {
        query = query.eq('user_id', selectedUser);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLog[];
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ['audit_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes('INSERT')) return 'bg-green-100 text-green-800';
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatAction = (action: string) => {
    const [operation, table] = action.split('_');
    return `${operation} ${table?.replace(/_/g, ' ')}`;
  };

  const exportLogs = () => {
    const csv = [
      'Date,User,Action,IP Address,Details',
      ...auditLogs.map(log => 
        `"${format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}","${log.profiles?.name || 'Unknown'}","${log.action}","${log.ip_address || 'N/A'}","${JSON.stringify(log.details).replace(/"/g, '""')}"`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Audit Logs
          </span>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="INSERT">Create Operations</SelectItem>
              <SelectItem value="UPDATE">Update Operations</SelectItem>
              <SelectItem value="DELETE">Delete Operations</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">Loading audit logs...</p>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">No audit logs found</p>
            </div>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge className={getActionBadgeColor(log.action)}>
                      {formatAction(log.action)}
                    </Badge>
                    <div>
                      <span className="font-medium">{log.profiles?.name || 'Unknown User'}</span>
                      <span className="text-sm text-gray-500 ml-2">({log.profiles?.role || 'Unknown Role'})</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{format(new Date(log.created_at), 'MMM dd, yyyy')}</div>
                    <div>{format(new Date(log.created_at), 'HH:mm:ss')}</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {log.details && typeof log.details === 'object' && (
                    <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                      {Object.entries(log.details).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {log.ip_address && (
                  <div className="text-xs text-gray-500">
                    IP Address: {log.ip_address}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
