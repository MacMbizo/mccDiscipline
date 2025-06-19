
import React from 'react';
import MetricCard from './MetricCard';
import { AlertTriangle, Award, TrendingUp, Users, Brain, Zap } from 'lucide-react';

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
  className?: string;
  showAdvanced?: boolean;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  data = {
    totalIncidents: 47,
    incidentsChange: 12,
    meritPoints: 1893,
    meritPointsChange: 23,
    avgHeatScore: 6.2,
    heatScoreChange: -5,
    studentsAtRisk: 12,
    studentsAtRiskChange: -3,
    predictedInterventions: 8,
    automationEfficiency: 87
  },
  className = "",
  showAdvanced = false
}) => {
  const basicMetrics = (
    <>
      <MetricCard
        label="Total Incidents"
        value={data.totalIncidents}
        change={data.incidentsChange}
        changeLabel="vs. last month"
        changeIsPositive={false}
        valueColor="#dc2626"
        icon={<AlertTriangle className="h-4 w-4" />}
      />
      
      <MetricCard
        label="Merit Points"
        value={data.meritPoints.toLocaleString()}
        change={data.meritPointsChange}
        changeLabel="% vs. last month"
        changeIsPositive={true}
        valueColor="#1E5BBC"
        icon={<Award className="h-4 w-4" />}
      />
      
      <MetricCard
        label="Avg. Heat Score"
        value={data.avgHeatScore.toFixed(1)}
        change={data.heatScoreChange}
        changeLabel="% vs. last month"
        changeIsPositive={data.heatScoreChange < 0}
        valueColor="#eab308"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      
      <MetricCard
        label="Students at Risk"
        value={data.studentsAtRisk}
        change={data.studentsAtRiskChange}
        changeLabel="students vs. last month"
        changeIsPositive={data.studentsAtRiskChange < 0}
        valueColor="#dc2626"
        icon={<Users className="h-4 w-4" />}
      />
    </>
  );

  const advancedMetrics = (
    <>
      <MetricCard
        label="Predicted Interventions"
        value={data.predictedInterventions || 0}
        change={-2}
        changeLabel="vs. last week"
        changeIsPositive={true}
        valueColor="#8b5cf6"
        icon={<Brain className="h-4 w-4" />}
      />
      
      <MetricCard
        label="Automation Efficiency"
        value={`${data.automationEfficiency || 0}%`}
        change={5}
        changeLabel="% improvement"
        changeIsPositive={true}
        valueColor="#059669"
        icon={<Zap className="h-4 w-4" />}
      />
    </>
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${showAdvanced ? '6' : '4'} gap-6 ${className}`}>
      {basicMetrics}
      {showAdvanced && advancedMetrics}
    </div>
  );
};

export default AnalyticsOverview;
