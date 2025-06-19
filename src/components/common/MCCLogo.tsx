
import React from 'react';

interface MCCLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const MCCLogo: React.FC<MCCLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}favicon.ico`}
        alt="Class Harmony Hub Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default MCCLogo;
