
import React from 'react';
import { Button } from '@/components/ui/button';
import MCCLogo from '@/components/common/MCCLogo';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  onLogout: () => void;
  additionalButtons?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  userName,
  onLogout,
  additionalButtons
}) => {
  return (
    <header className="bg-mcc-blue text-white p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <MCCLogo size="sm" />
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-blue-100">{subtitle}</p>}
            {userName && <p className="text-blue-100">Welcome back, {userName}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          {additionalButtons}
          <Button onClick={onLogout} variant="outline" className="text-mcc-blue border-white hover:bg-white">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
