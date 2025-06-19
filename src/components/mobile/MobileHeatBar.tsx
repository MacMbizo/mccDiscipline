
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MobileHeatBarProps {
  score: number;
  previousScore?: number;
  maxScore?: number;
  showTrend?: boolean;
  className?: string;
}

const MobileHeatBar: React.FC<MobileHeatBarProps> = ({
  score,
  previousScore,
  maxScore = 10,
  showTrend = true,
  className = ""
}) => {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const isImproving = previousScore && score < previousScore;
  const isWorsening = previousScore && score > previousScore;
  const change = previousScore ? Math.abs(score - previousScore) : 0;

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'bg-blue-500'; // Excellent
    if (score <= 5) return 'bg-blue-400'; // Good
    if (score <= 7) return 'bg-yellow-500'; // Warning
    return 'bg-red-500'; // Critical
  };

  const getScoreLabel = (score: number) => {
    if (score <= 3) return 'Excellent';
    if (score <= 5) return 'Good';
    if (score <= 7) return 'Warning';
    return 'Critical';
  };

  const getScoreDescription = (score: number) => {
    if (score <= 3) return 'Keep up the excellent behavior!';
    if (score <= 5) return 'Good behavior with room for improvement.';
    if (score <= 7) return 'Some concerns - focus on improvement.';
    return 'Immediate attention required.';
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Behavior Score</span>
          <Badge 
            variant={score <= 5 ? 'secondary' : score <= 7 ? 'outline' : 'destructive'}
            className="text-sm"
          >
            {getScoreLabel(score)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-800 mb-1">
            {score.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">
            out of {maxScore}
          </div>
        </div>

        {/* Visual Heat Bar */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getScoreColor(score)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* Scale Labels */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>2.5</span>
            <span>5.0</span>
            <span>7.5</span>
            <span>10.0</span>
          </div>
        </div>

        {/* Trend Indicator */}
        {showTrend && previousScore && (
          <div className="flex items-center justify-center gap-2 p-2 bg-gray-50 rounded-lg">
            {isImproving && (
              <>
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  Improved by {change.toFixed(1)}
                </span>
              </>
            )}
            {isWorsening && (
              <>
                <TrendingUp className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">
                  Increased by {change.toFixed(1)}
                </span>
              </>
            )}
            {!isImproving && !isWorsening && (
              <>
                <Minus className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">
                  No change
                </span>
              </>
            )}
          </div>
        )}

        {/* Description */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {getScoreDescription(score)}
          </p>
        </div>

        {/* Color Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Excellent (0-3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>Good (3-5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Warning (5-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Critical (7+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileHeatBar;
