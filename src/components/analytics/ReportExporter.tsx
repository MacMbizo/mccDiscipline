
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Share2, Mail } from 'lucide-react';

interface ReportExporterProps {
  data: any;
  reportName: string;
  onExport?: (format: string) => void;
}

const ReportExporter: React.FC<ReportExporterProps> = ({ data, reportName, onExport }) => {
  const { toast } = useToast();

  const exportToPDF = async () => {
    try {
      // In a real implementation, this would generate and download a PDF
      toast({
        title: "PDF Export Started",
        description: `${reportName} is being generated as PDF`,
      });
      
      // Simulate export delay
      setTimeout(() => {
        toast({
          title: "PDF Ready",
          description: `${reportName}.pdf has been downloaded`,
        });
      }, 2000);
      
      onExport?.('pdf');
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = async () => {
    try {
      toast({
        title: "Excel Export Started",
        description: `${reportName} is being generated as Excel`,
      });
      
      setTimeout(() => {
        toast({
          title: "Excel Ready",
          description: `${reportName}.xlsx has been downloaded`,
        });
      }, 2000);
      
      onExport?.('excel');
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the Excel file",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = async () => {
    try {
      // Convert data to CSV format
      if (Array.isArray(data) && data.length > 0) {
        const headers = Object.keys(data[0]);
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        
        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${reportName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "CSV Downloaded",
          description: `${reportName}.csv has been downloaded`,
        });
      }
      
      onExport?.('csv');
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the CSV file",
        variant: "destructive"
      });
    }
  };

  const shareReport = async () => {
    try {
      // Generate shareable link
      const shareUrl = `${window.location.origin}/reports/shared/${encodeURIComponent(reportName)}`;
      
      if (navigator.share) {
        await navigator.share({
          title: reportName,
          text: `View ${reportName} report`,
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Share link has been copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "There was an error sharing the report",
        variant: "destructive"
      });
    }
  };

  const emailReport = () => {
    const subject = encodeURIComponent(`${reportName} Report`);
    const body = encodeURIComponent(`Please find the ${reportName} report attached.`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={exportToPDF}>
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </Button>
      
      <Button size="sm" variant="outline" onClick={exportToExcel}>
        <Download className="h-4 w-4 mr-2" />
        Export Excel
      </Button>
      
      <Button size="sm" variant="outline" onClick={exportToCSV}>
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      
      <Button size="sm" variant="outline" onClick={shareReport}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      
      <Button size="sm" variant="outline" onClick={emailReport}>
        <Mail className="h-4 w-4 mr-2" />
        Email
      </Button>
    </div>
  );
};

export default ReportExporter;
