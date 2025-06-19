
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ChartDataPoint {
  name: string;
  incidents: number;
  merits: number;
  heatScore: number;
}

interface BehaviorChartProps {
  data?: ChartDataPoint[];
  type?: 'bar' | 'line';
  title?: string;
  className?: string;
}

const BehaviorChart: React.FC<BehaviorChartProps> = ({
  data = [
    { name: 'Jan', incidents: 23, merits: 145, heatScore: 6.8 },
    { name: 'Feb', incidents: 31, merits: 132, heatScore: 7.2 },
    { name: 'Mar', incidents: 28, merits: 156, heatScore: 6.5 },
    { name: 'Apr', incidents: 19, merits: 178, heatScore: 5.9 },
    { name: 'May', incidents: 25, merits: 165, heatScore: 6.1 },
    { name: 'Jun', incidents: 22, merits: 189, heatScore: 5.7 },
  ],
  type = 'bar',
  title = 'Behavior Trends Over Time',
  className = ""
}) => {
  const chartConfig = {
    incidents: {
      label: 'Incidents',
      color: '#dc2626',
    },
    merits: {
      label: 'Merit Points',
      color: '#1E5BBC',
    },
    heatScore: {
      label: 'Heat Score',
      color: '#eab308',
    },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-mcc-blue-dark">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          {type === 'bar' ? (
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="incidents" fill="var(--color-incidents)" />
              <Bar dataKey="merits" fill="var(--color-merits)" />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="heatScore" 
                stroke="var(--color-heatScore)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-heatScore)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BehaviorChart;
