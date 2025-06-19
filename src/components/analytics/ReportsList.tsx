
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  lastGenerated?: string;
}

interface ReportsListProps {
  reports: ReportItem[];
  onGenerateReport: (reportId: string) => void;
  onDownloadReport: (reportId: string, format: 'pdf' | 'csv' | 'excel') => void;
}

const ReportsList: React.FC<ReportsListProps> = ({
  reports,
  onGenerateReport,
  onDownloadReport,
}) => {
  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-mcc-blue">
              {report.icon}
            </div>
            <div>
              <h3 className="font-semibold text-mcc-blue-dark">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
              {report.lastGenerated && (
                <p className="text-xs text-gray-500 mt-1">
                  Last generated: {report.lastGenerated}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadReport(report.id, 'pdf')}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGenerateReport(report.id)}
            >
              Generate
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportsList;
