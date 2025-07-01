
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, AlertTriangle, Award } from 'lucide-react';
import ResponsiveGrid from '@/components/mobile/ResponsiveGrid';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnalyticsData {
  totalIncidents: number;
  incidentsChange: number;
  meritPoints: number;
  meritPointsChange: number;
  avgHeatScore: number;
  heatScoreChange: number;
  studentsAtRisk: number;
  studentsAtRiskChange: number;
  predictedInterventions?: number;
  automationEfficiency?: number;
}

interface AnalyticsOverviewProps {
  data?: AnalyticsData;
  showAdvanced?: boolean;
}

/**
 * AnalyticsOverview - Responsive analytics dashboard
 * Mobile: Single column with larger touch targets
 * Desktop: Multi-column grid with compact layout
 */
const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ 
  data = {
    totalIncidents: 0,
    incidentsChange: 0,
    meritPoints: 0,
    meritPointsChange: 0,
    avgHeatScore: 0,
    heatScoreChange: 0,
    studentsAtRisk: 0,
    studentsAtRiskChange: 0
  },
  showAdvanced = false 
}) => {
  const isMobile = useIsMobile();

  const formatChange = (value: number, isPercentage: boolean = true) => {
    const prefix = value > 0 ? '+' : '';
    const suffix = isPercentage ? '%' : '';
    return `${prefix}${value}${suffix}`;
  };

  const getChangeColor = (value: number, isNegativeGood: boolean = false) => {
    if (value === 0) return 'text-gray-600';
    const isPositive = value > 0;
    if (isNegativeGood) {
      return isPositive ? 'text-red-600' : 'text-green-600';
    }
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (value: number, isNegativeGood: boolean = false) => {
    if (value === 0) return null;
    const isUp = value > 0;
    const iconSize = isMobile ? "h-4 w-4" : "h-3 w-3";
    return isUp ? <TrendingUp className={iconSize} /> : <TrendingDown className={iconSize} />;
  };

  const metrics = [
    {
      label: 'Total Incidents',
      value: data.totalIncidents,
      change: data.incidentsChange,
      changeLabel: 'vs. last month',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      icon: AlertTriangle,
      isNegativeGood: true
    },
    {
      label: 'Merit Points',
      value: data.meritPoints,
      change: data.meritPointsChange,
      changeLabel: 'vs. last month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      icon: Award,
      isNegativeGood: false
    },
    {
      label: 'Avg. Heat Score',
      value: data.avgHeatScore.toFixed(1),
      change: data.heatScoreChange,
      changeLabel: 'vs. last month',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      icon: TrendingUp,
      isNegativeGood: true
    },
    {
      label: 'Students at Risk',
      value: data.studentsAtRisk,
      change: data.studentsAtRiskChange,
      changeLabel: 'vs. last month',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      icon: Users,
      isNegativeGood: true,
      isNumericChange: true
    }
  ];

  const advancedMetrics = [
    {
      label: 'Predicted Interventions',
      value: data.predictedInterventions || 0,
      description: 'AI-predicted interventions needed this week'
    },
    {
      label: 'Automation Efficiency',
      value: `${data.automationEfficiency || 0}%`,
      description: 'Time saved through automated workflows'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Metrics Grid - Responsive */}
      <ResponsiveGrid
        cols={{ mobile: 1, tablet: 2, desktop: 4 }}
        gap={isMobile ? 'sm' : 'md'}
      >
        {metrics.map((metric) => (
          <Card key={metric.label} className={`
            relative overflow-hidden
            ${isMobile ? 'min-h-[120px]' : 'min-h-[140px]'}
            hover:shadow-md transition-shadow duration-200
          `}>
            <CardContent className={`
              ${isMobile ? 'p-4' : 'p-4 lg:p-6'}
            `}>
              <div className={`
                flex items-center justify-between
                ${isMobile ? 'mb-3' : 'mb-2'}
              `}>
                <div className={`
                  ${isMobile ? 'p-3' : 'p-2'} 
                  rounded-lg ${metric.bgColor}
                `}>
                  <metric.icon className={`
                    ${isMobile ? 'h-5 w-5' : 'h-4 w-4'} 
                    ${metric.iconColor}
                  `} />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className={`
                  ${isMobile ? 'text-sm' : 'text-xs'} 
                  text-gray-600 font-medium
                `}>
                  {metric.label}
                </p>
                <p className={`
                  ${isMobile ? 'text-2xl' : 'text-xl'} 
                  font-bold ${metric.color}
                `}>
                  {metric.value}
                </p>
                
                <div className={`
                  flex items-center gap-1
                  ${isMobile ? 'text-sm' : 'text-xs'}
                `}>
                  <span className={`
                    font-medium flex items-center gap-1 
                    ${getChangeColor(metric.change, metric.isNegativeGood)}
                  `}>
                    {getChangeIcon(metric.change, metric.isNegativeGood)}
                    {formatChange(metric.change, !metric.isNumericChange)}
                  </span>
                  <span className="text-gray-500">{metric.changeLabel}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </ResponsiveGrid>

      {/* Advanced Metrics - Responsive */}
      {showAdvanced && (
        <ResponsiveGrid
          cols={{ mobile: 1, tablet: 1, desktop: 2 }}
          gap={isMobile ? 'sm' : 'md'}
        >
          {advancedMetrics.map((metric) => (
            <Card key={metric.label} className="border-l-4 border-l-purple-500">
              <CardContent className={`
                ${isMobile ? 'p-4' : 'p-4 lg:p-6'}
              `}>
                <div className={`
                  flex items-center justify-between
                  ${isMobile ? 'flex-col items-start gap-3' : ''}
                `}>
                  <div className={isMobile ? 'w-full' : ''}>
                    <p className={`
                      ${isMobile ? 'text-base' : 'text-sm'} 
                      font-medium text-gray-900
                    `}>
                      {metric.label}
                    </p>
                    <p className={`
                      ${isMobile ? 'text-sm' : 'text-xs'} 
                      text-gray-600 mt-1
                    `}>
                      {metric.description}
                    </p>
                  </div>
                  <div className={`
                    ${isMobile ? 'w-full text-left' : 'text-right'}
                  `}>
                    <p className={`
                      ${isMobile ? 'text-3xl' : 'text-2xl'} 
                      font-bold text-purple-600
                    `}>
                      {metric.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ResponsiveGrid>
      )}

      {/* Summary Insights - Mobile Optimized */}
      {showAdvanced && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className={`
            ${isMobile ? 'p-4' : 'p-4 lg:p-6'}
          `}>
            <h4 className={`
              font-semibold text-blue-900 mb-3
              ${isMobile ? 'text-lg' : 'text-base'}
            `}>
              Key Insights
            </h4>
            <div className={`
              space-y-2 
              ${isMobile ? 'text-base' : 'text-sm'}
            `}>
              {data.incidentsChange < 0 && (
                <p className="text-green-800 leading-relaxed">
                  ✓ Incidents decreased by {Math.abs(data.incidentsChange)}% - improvement in student behavior
                </p>
              )}
              {data.meritPointsChange > 0 && (
                <p className="text-green-800 leading-relaxed">
                  ✓ Merit points increased by {data.meritPointsChange}% - positive reinforcement working
                </p>
              )}
              {data.studentsAtRisk > 0 && (
                <p className="text-orange-800 leading-relaxed">
                  ⚠ {data.studentsAtRisk} students currently flagged for intervention
                </p>
              )}
              {(data.automationEfficiency || 0) > 80 && (
                <p className="text-blue-800 leading-relaxed">
                  ✓ High automation efficiency - workflows saving significant time
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsOverview;
