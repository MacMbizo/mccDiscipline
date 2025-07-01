
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import MCCLogo from '@/components/common/MCCLogo';
import NotificationCenter from '@/components/common/NotificationCenter';

interface DashboardHeaderProps {
  title: string;
  userName?: string;
  onLogout: () => void;
  onMenuClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  userName,
  onLogout,
  onMenuClick
}) => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="flex items-center justify-between p-3 lg:p-4">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center gap-3 lg:gap-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden text-white hover:bg-blue-700"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-2 lg:gap-3">
            <MCCLogo size="sm" className="text-white" />
            <div>
              <h1 className="text-base lg:text-xl font-bold">{title}</h1>
              <div className="text-xs lg:text-sm text-blue-100">
                Midlands Christian College
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - User Info and Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* User Welcome */}
          {userName && (
            <div className="hidden sm:block text-right">
              <div className="text-sm lg:text-base font-medium">
                Welcome, {userName}
              </div>
              <div className="text-xs lg:text-sm text-blue-200">
                Have a great day!
              </div>
            </div>
          )}

          {/* Notification Center */}
          <NotificationCenter />

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-white hover:bg-blue-700 flex items-center gap-1 lg:gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
