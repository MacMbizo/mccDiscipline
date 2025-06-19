
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HeatBarProps {
  score: number;
  previousScore?: number;
  maxScore?: number;
  showTrend?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const HeatBar: React.FC<HeatBarProps> = ({
  score,
  previousScore,
  maxScore = 10,
  showTrend = true,
  className = '',
  size = 'md'
}) => {
  // Calculate percentage for the progress bar (inverted since lower scores are better)
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  // Determine color based on score thresholds
  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-blue-600'; // Excellent
    if (score <= 5) return 'text-green-600'; // Good
    if (score <= 7) return 'text-yellow-600'; // Warning
    if (score <= 9) return 'text-orange-600'; // Concerning
    return 'text-red-600'; // Critical
  };

  const getProgressColor = (score: number) => {
    if (score <= 3) return 'bg-blue-500'; // Excellent
    if (score <= 5) return 'bg-green-500'; // Good
    if (score <= 7) return 'bg-yellow-500'; // Warning
    if (score <= 9) return 'bg-orange-500'; // Concerning
    return 'bg-red-500'; // Critical
  };

  const getScoreLabel = (score: number) => {
    if (score <= 3) return 'Excellent';
    if (score <= 5) return 'Good';
    if (score <= 7) return 'Warning';
    if (score <= 9) return 'Concerning';
    return 'Critical';
  };

  // Calculate trend
  const trend = previousScore !== undefined ? score - previousScore : 0;
  const trendPercentage = previousScore ? ((trend / previousScore) * 100) : 0;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${textSizeClasses[size]} ${getScoreColor(score)}`}>
            Heat Score: {score.toFixed(1)}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            score <= 3 ? 'bg-blue-100 text-blue-700' :
            score <= 5 ? 'bg-green-100 text-green-700' :
            score <= 7 ? 'bg-yellow-100 text-yellow-700' :
            score <= 9 ? 'bg-orange-100 text-orange-700' :
            'bg-red-100 text-red-700'
          }`}>
            {getScoreLabel(score)}
          </span>
        </div>
        
        {showTrend && previousScore !== undefined && (
          <div className="flex items-center gap-1 text-xs">
            {trend > 0 ? (
              <>
                <TrendingUp className="h-3 w-3 text-red-500" />
                <span className="text-red-600">+{Math.abs(trendPercentage).toFixed(1)}%</span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-green-600">-{Math.abs(trendPercentage).toFixed(1)}%</span>
              </>
            ) : (
              <>
                <Minus className="h-3 w-3 text-gray-500" />
                <span className="text-gray-600">No change</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <Progress 
          value={percentage} 
          className={`w-full ${sizeClasses[size]} bg-gray-200`}
        />
        <div 
          className={`absolute top-0 left-0 h-full rounded-full transition-all ${getProgressColor(score)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>0 (Best)</span>
        <span>{maxScore}+ (Needs Intervention)</span>
      </div>
    </div>
  );
};

export default HeatBar;
