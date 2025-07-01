
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

/**
 * ResponsiveLayout - Provides consistent responsive wrapper
 * Uses mobile-first approach with progressive enhancement
 */
const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = "",
  mobileClassName = "",
  desktopClassName = ""
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`
      w-full min-h-screen
      ${className}
      ${isMobile ? mobileClassName : desktopClassName}
    `}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;
