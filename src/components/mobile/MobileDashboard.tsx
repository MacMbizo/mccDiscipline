
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu, Search, Settings } from 'lucide-react';
import MobileHeatBar from './MobileHeatBar';
import QuickActions from './QuickActions';

interface MobileDashboardProps {
  children?: React.ReactNode;
  className?: string;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ 
  children, 
  className = "" 
}) => {
  const { user } = useAuth();

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Mobile Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-blue-700 rounded-lg">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-semibold">MCC Tracker</h1>
              <p className="text-xs text-blue-100">
                {user?.name} • {user?.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-blue-700 rounded-lg relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </Badge>
            </button>
            <button className="p-2 hover:bg-blue-700 rounded-lg">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students, records..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-4 space-y-4 pb-20">
        {/* Role-specific content or children */}
        {children || (
          <>
            {/* Sample mobile dashboard content */}
            <MobileHeatBar 
              score={6.2} 
              previousScore={6.8} 
              showTrend={true}
            />
            
            <QuickActions userRole={user?.role || 'student'} />

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">!</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lateness to Class</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      1st Offense
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">★</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Silver Merit Award</p>
                      <p className="text-xs text-gray-600">Yesterday</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      +2 pts
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {['Home', 'Records', 'Analytics', 'Messages', 'Profile'].map((item, index) => (
            <button
              key={item}
              className={`flex flex-col items-center gap-1 p-2 ${
                index === 0 ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className="w-6 h-6 bg-current rounded opacity-20"></div>
              <span className="text-xs font-medium">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
