
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, AlertTriangle, Award } from 'lucide-react';

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
    const isGood = isNegativeGood ? !isUp : isUp;
    return isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
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
    <div className="space-y-4">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-600 font-medium">{metric.label}</p>
                <p className={`text-xl font-bold ${metric.color}`}>
                  {metric.value}
                </p>
                
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-medium flex items-center gap-1 ${
                    getChangeColor(metric.change, metric.isNegativeGood)
                  }`}>
                    {getChangeIcon(metric.change, metric.isNegativeGood)}
                    {formatChange(metric.change, !metric.isNumericChange)}
                  </span>
                  <span className="text-xs text-gray-500">{metric.changeLabel}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Metrics */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advancedMetrics.map((metric) => (
            <Card key={metric.label} className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{metric.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Insights */}
      {showAdvanced && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Key Insights</h4>
            <div className="space-y-2 text-sm">
              {data.incidentsChange < 0 && (
                <p className="text-green-800">
                  ✓ Incidents decreased by {Math.abs(data.incidentsChange)}% - improvement in student behavior
                </p>
              )}
              {data.meritPointsChange > 0 && (
                <p className="text-green-800">
                  ✓ Merit points increased by {data.meritPointsChange}% - positive reinforcement working
                </p>
              )}
              {data.studentsAtRisk > 0 && (
                <p className="text-orange-800">
                  ⚠ {data.studentsAtRisk} students currently flagged for intervention
                </p>
              )}
              {(data.automationEfficiency || 0) > 80 && (
                <p className="text-blue-800">
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
