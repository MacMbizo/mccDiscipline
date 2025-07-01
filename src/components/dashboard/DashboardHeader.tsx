
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Settings, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MCCLogo from '@/components/common/MCCLogo';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  onLogout: () => void;
  additionalButtons?: React.ReactNode;
  onMenuToggle?: () => void;
}

/**
 * DashboardHeader - Responsive header with mobile-first design
 * Collapses to hamburger menu on mobile, full layout on desktop
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  userName,
  onLogout,
  additionalButtons,
  onMenuToggle
}) => {
  const isMobile = useIsMobile();

  return (
    <header className="
      sticky top-0 z-50
      bg-mcc-blue text-white
      border-b border-mcc-blue-dark
      shadow-lg
    ">
      <div className="
        px-4 sm:px-6 lg:px-8
        py-3 sm:py-4
      ">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onMenuToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMenuToggle}
                  className="text-white hover:bg-mcc-blue-light p-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <MCCLogo size="sm" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold truncate">{title}</h1>
                {userName && (
                  <p className="text-xs text-blue-100 truncate">{userName}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-mcc-blue-light p-2 relative"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-white hover:bg-mcc-blue-light p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MCCLogo size="sm" />
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {subtitle && <p className="text-blue-100 text-sm">{subtitle}</p>}
                {userName && <p className="text-blue-100 text-sm">Welcome back, {userName}</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-white hover:bg-mcc-blue-light relative"
              >
                <Bell className="h-5 w-5 mr-2" />
                Notifications
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
              
              {additionalButtons}
              
              <Button
                onClick={onLogout}
                variant="outline"
                className="text-mcc-blue border-white hover:bg-white hover:text-mcc-blue"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
