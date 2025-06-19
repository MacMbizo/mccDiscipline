
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';

interface BehaviorRecordsTableProps {
  studentId?: string;
  showActions?: boolean;
  title?: string;
}

const BehaviorRecordsTable: React.FC<BehaviorRecordsTableProps> = ({
  studentId,
  showActions = true,
  title = "Behavior Records"
}) => {
  const { data: records, isLoading, error } = useBehaviorRecords(studentId);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'closed': return 'default';
      default: return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'incident': return 'destructive';
      case 'merit': return 'default';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Loading records...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-red-500">Error loading records. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!records || records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-gray-500">No behavior records found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="outline">{records.length} records</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reporter</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record: any) => (
              <TableRow key={record.id}>
                <TableCell className="text-sm">
                  {formatDate(record.timestamp || record.created_at || '')}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{record.student?.name || 'Unknown Student'}</p>
                    <p className="text-xs text-gray-500">{record.student?.grade || 'Unknown Grade'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getTypeBadgeVariant(record.type)}>
                    {record.type}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  {record.type === 'incident' ? (
                    <div>
                      <p className="font-medium text-sm">{record.misdemeanor?.name || 'Unknown Misdemeanor'}</p>
                      {record.offense_number && (
                        <p className="text-xs text-gray-600">
                          {record.offense_number}{getOrdinalSuffix(record.offense_number)} offense
                        </p>
                      )}
                      {record.sanction && (
                        <p className="text-xs text-red-600 mt-1">
                          Sanction: {record.sanction.length > 50 ? record.sanction.substring(0, 50) + '...' : record.sanction}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-sm text-green-700">{record.merit_tier || 'Merit'}</p>
                      <p className="text-xs text-green-600">{record.points || 0} points</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {record.description ? 
                      (record.description.length > 60 ? record.description.substring(0, 60) + '...' : record.description)
                      : 'No description'
                    }
                  </p>
                </TableCell>
                <TableCell>
                  {record.type === 'incident' && (
                    <Badge variant={getStatusBadgeVariant(record.status || 'open')}>
                      {record.status || 'open'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {record.reporter?.name || 'Unknown'}
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const getOrdinalSuffix = (num: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const mod100 = num % 100;
  return (mod100 >= 11 && mod100 <= 13) ? 'th' : suffixes[num % 10] || 'th';
};

export default BehaviorRecordsTable;
