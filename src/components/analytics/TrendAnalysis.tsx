
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useBehaviorRecords } from '@/hooks/useBehaviorRecords';
import { useStudents } from '@/hooks/useStudents';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users,
  AlertTriangle,
  Award,
  BarChart3
} from 'lucide-react';

interface TrendAnalysisProps {
  className?: string;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ className = "" }) => {
  const { data: records = [] } = useBehaviorRecords();
  const { data: students = [] } = useStudents();

  // Calculate trend data
  const trendData = React.useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        incidents: 0,
        merits: 0,
        avgHeatScore: 0,
        studentsAtRisk: 0
      };
    });

    // Populate with actual data
    records.forEach(record => {
      const recordDate = new Date(record.timestamp || '');
      const monthIndex = trendData.findIndex(d => 
        d.month === recordDate.toLocaleDateString('en-US', { month: 'short' }) &&
        d.year === recordDate.getFullYear()
      );

      if (monthIndex >= 0) {
        if (record.type === 'incident') {
          trendData[monthIndex].incidents++;
        } else if (record.type === 'merit') {
          trendData[monthIndex].merits++;
        }
      }
    });

    // Calculate average heat scores and students at risk for each month
    trendData.forEach(month => {
      const studentsWithScores = students.filter(s => s.behavior_score !== null);
      month.avgHeatScore = studentsWithScores.length > 0 
        ? studentsWithScores.reduce((sum, s) => sum + (s.behavior_score || 0), 0) / studentsWithScores.length
        : 0;
      month.studentsAtRisk = students.filter(s => (s.behavior_score || 0) > 7).length;
    });

    return trendData;
  }, [records, students]);

  // Calculate trend direction and percentage
  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return { direction: 'stable', percentage: 0 };
    
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    
    if (current === previous) return { direction: 'stable', percentage: 0 };
    
    const percentage = Math.abs(((current - previous) / previous) * 100);
    const direction = current > previous ? 'up' : 'down';
    
    return { direction, percentage: Math.round(percentage) };
  };

  const incidentTrend = calculateTrend(trendData.map(d => d.incidents));
  const meritTrend = calculateTrend(trendData.map(d => d.merits));
  const heatScoreTrend = calculateTrend(trendData.map(d => d.avgHeatScore));

  const chartConfig = {
    incidents: { label: 'Incidents', color: '#dc2626' },
    merits: { label: 'Merits', color: '#16a34a' },
    avgHeatScore: { label: 'Avg Heat Score', color: '#eab308' },
    studentsAtRisk: { label: 'Students at Risk', color: '#ea580c' }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Trend Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Incident Trend</p>
                <p className="text-2xl font-bold text-red-600">
                  {trendData[trendData.length - 1]?.incidents || 0}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {incidentTrend.direction === 'up' && <TrendingUp className="h-4 w-4 text-red-600" />}
                  {incidentTrend.direction === 'down' && <TrendingDown className="h-4 w-4 text-green-600" />}
                  <span className={`text-sm ${incidentTrend.direction === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                    {incidentTrend.percentage}%
                  </span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Merit Trend</p>
                <p className="text-2xl font-bold text-green-600">
                  {trendData[trendData.length - 1]?.merits || 0}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {meritTrend.direction === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {meritTrend.direction === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                  <span className={`text-sm ${meritTrend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {meritTrend.percentage}%
                  </span>
                </div>
              </div>
              <Award className="h-8 w-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Heat Score Trend</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(trendData[trendData.length - 1]?.avgHeatScore || 0).toFixed(1)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {heatScoreTrend.direction === 'up' && <TrendingUp className="h-4 w-4 text-red-600" />}
                  {heatScoreTrend.direction === 'down' && <TrendingDown className="h-4 w-4 text-green-600" />}
                  <span className={`text-sm ${heatScoreTrend.direction === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                    {heatScoreTrend.percentage}%
                  </span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incident vs Merit Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Incidents vs Merit Awards (6 Month Trend)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="incidents" 
                stroke="var(--color-incidents)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-incidents)', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="merits" 
                stroke="var(--color-merits)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-merits)', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Heat Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Average Behavior Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <AreaChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis domain={[0, 10]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="avgHeatScore" 
                stroke="var(--color-avgHeatScore)"
                fill="var(--color-avgHeatScore)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Behavior Trends</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• {incidentTrend.direction === 'down' ? 'Incidents decreasing' : 'Incidents increasing'} by {incidentTrend.percentage}%</li>
                <li>• {meritTrend.direction === 'up' ? 'Merit awards increasing' : 'Merit awards decreasing'} by {meritTrend.percentage}%</li>
                <li>• Average heat score is {heatScoreTrend.direction === 'down' ? 'improving' : 'worsening'}</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Recommendations</h4>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• Continue positive reinforcement programs</li>
                <li>• Monitor students with rising heat scores</li>
                <li>• Implement targeted intervention strategies</li>
                <li>• Regular review of behavior policies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;
