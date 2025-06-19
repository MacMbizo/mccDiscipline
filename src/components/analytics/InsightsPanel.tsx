
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InsightsPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-800">Positive Trend</h4>
            <p className="text-sm text-green-700">Merit points increased by 23% this month</p>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800">Watch Area</h4>
            <p className="text-sm text-yellow-700">Grade 9 showing higher incident rates</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-blue-800">Recommendation</h4>
            <p className="text-sm text-blue-700">Focus on proactive merit recognition</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Overall Behavior Score</span>
            <span className="font-bold text-green-600">Good</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Merit/Incident Ratio</span>
            <span className="font-bold text-blue-600">3.2:1</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Students at Risk</span>
            <span className="font-bold text-yellow-600">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Improvement Rate</span>
            <span className="font-bold text-green-600">+15%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsPanel;
