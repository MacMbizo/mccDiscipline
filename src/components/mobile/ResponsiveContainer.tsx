
import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * ResponsiveContainer - Provides consistent max-width and centering
 * Mobile-first with fluid scaling and proper spacing
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = "",
  size = 'xl'
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full'
  };

  return (
    <div className={`
      w-full mx-auto
      px-4 sm:px-6 lg:px-8
      ${sizeClasses[size]}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
