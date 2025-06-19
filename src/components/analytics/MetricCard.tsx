
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  changeIsPositive?: boolean;
  valueColor?: string;
  icon?: React.ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  changeLabel = "vs. last month",
  changeIsPositive,
  valueColor = "#1E5BBC",
  icon,
  className = ""
}) => {
  const formatChange = (change: number) => {
    const absChange = Math.abs(change);
    if (changeLabel.includes('%')) {
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    }
    return `${change > 0 ? '+' : ''}${change}`;
  };

  const getTrendIcon = () => {
    if (change === undefined || change === 0) {
      return <Minus className="h-3 w-3 text-gray-500" />;
    }
    
    if (changeIsPositive === undefined) {
      // Default logic: positive change is good for positive metrics, bad for negative metrics
      return change > 0 ? (
        <TrendingUp className="h-3 w-3 text-green-500" />
      ) : (
        <TrendingDown className="h-3 w-3 text-red-500" />
      );
    }
    
    return changeIsPositive ? (
      <TrendingUp className="h-3 w-3 text-green-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-500" />
    );
  };

  const getChangeColor = () => {
    if (change === undefined || change === 0) {
      return 'text-gray-600';
    }
    
    if (changeIsPositive === undefined) {
      return change > 0 ? 'text-green-600' : 'text-red-600';
    }
    
    return changeIsPositive ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2" style={{ color: valueColor }}>
          {value}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs">
            {getTrendIcon()}
            <span className={getChangeColor()}>
              {formatChange(change)}
            </span>
            <span className="text-gray-500 ml-1">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
