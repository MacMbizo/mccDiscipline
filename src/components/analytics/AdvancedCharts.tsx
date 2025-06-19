
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';

interface AdvancedChartsProps {
  className?: string;
}

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ className = "" }) => {
  // Sample data for different chart types
  const gradeData = [
    { grade: 'Grade 8', incidents: 15, merits: 85, students: 120 },
    { grade: 'Grade 9', incidents: 22, merits: 78, students: 115 },
    { grade: 'Grade 10', incidents: 18, merits: 92, students: 108 },
    { grade: 'Grade 11', incidents: 12, merits: 95, students: 98 },
    { grade: 'Grade 12', incidents: 8, merits: 102, students: 89 },
  ];

  const heatScoreDistribution = [
    { range: '0-2', count: 45, color: '#22c55e' },
    { range: '2-4', count: 78, color: '#3b82f6' },
    { range: '4-6', count: 65, color: '#eab308' },
    { range: '6-8', count: 32, color: '#f97316' },
    { range: '8-10', count: 12, color: '#dc2626' },
  ];

  const weeklyTrend = [
    { week: 'Week 1', incidents: 8, merits: 45, netScore: 37 },
    { week: 'Week 2', incidents: 12, merits: 52, netScore: 40 },
    { week: 'Week 3', incidents: 6, merits: 38, netScore: 32 },
    { week: 'Week 4', incidents: 15, merits: 48, netScore: 33 },
    { week: 'Week 5', incidents: 9, merits: 55, netScore: 46 },
    { week: 'Week 6', incidents: 7, merits: 42, netScore: 35 },
  ];

  const misdemeanorTypes = [
    { name: 'Dress Code', value: 35, color: '#3b82f6' },
    { name: 'Lateness', value: 28, color: '#8b5cf6' },
    { name: 'Homework', value: 22, color: '#06b6d4' },
    { name: 'Disruption', value: 15, color: '#10b981' },
  ];

  const chartConfig = {
    incidents: { label: 'Incidents', color: '#dc2626' },
    merits: { label: 'Merit Points', color: '#1E5BBC' },
    netScore: { label: 'Net Score', color: '#22c55e' },
    students: { label: 'Students', color: '#8b5cf6' },
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Grade Level Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Level Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={gradeData}>
              <XAxis dataKey="grade" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="incidents" fill="var(--color-incidents)" />
              <Bar dataKey="merits" fill="var(--color-merits)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Heat Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Heat Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={heatScoreDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count }) => `${range}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {heatScoreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Weekly Behavior Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Behavior Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={weeklyTrend}>
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="netScore"
                stackId="1"
                stroke="var(--color-netScore)"
                fill="var(--color-netScore)"
                fillOpacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="incidents"
                stroke="var(--color-incidents)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Misdemeanor Types */}
      <Card>
        <CardHeader>
          <CardTitle>Common Misdemeanor Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={misdemeanorTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {misdemeanorTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedCharts;
