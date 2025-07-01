
import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * ResponsiveGrid - Provides responsive grid layout
 * Automatically adjusts columns based on screen size
 */
const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = ""
}) => {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  return (
    <div className={`
      grid
      grid-cols-${cols.mobile}
      sm:grid-cols-${cols.tablet}  
      lg:grid-cols-${cols.desktop}
      ${gapClasses[gap]}
      w-full
      ${className}
    `}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;
