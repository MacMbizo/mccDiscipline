
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu, Search, Settings, X, Home, Users, BarChart3, MessageSquare, User } from 'lucide-react';
import MobileHeatBar from './MobileHeatBar';
import QuickActions from './QuickActions';
import ResponsiveContainer from './ResponsiveContainer';

interface MobileDashboardProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * MobileDashboard - Enhanced mobile-first dashboard layout
 * Features collapsible navigation, optimized spacing, and touch-friendly interfaces
 */
const MobileDashboard: React.FC<MobileDashboardProps> = ({ 
  children, 
  className = "" 
}) => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, active: true },
    { id: 'students', label: 'Students', icon: Users, active: false },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, active: false },
    { id: 'messages', label: 'Messages', icon: MessageSquare, active: false },
    { id: 'profile', label: 'Profile', icon: User, active: false }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Enhanced Mobile Header */}
      <div className="bg-mcc-blue text-white sticky top-0 z-50 shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-mcc-blue-light p-2 shrink-0"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <div className="min-w-0 flex-1">
                <h1 className="font-semibold text-lg truncate">MCC Tracker</h1>
                <p className="text-xs text-blue-100 truncate">
                  {user?.name} • {user?.role}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                variant="ghost"
                size="sm"
                className="text-white hover:bg-mcc-blue-light p-2 relative"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                className="text-white hover:bg-mcc-blue-light p-2"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students, records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-10 pr-4 py-3
                bg-white/10 border border-white/20 rounded-lg
                text-white placeholder-white/70
                focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                transition-all duration-200
              "
            />
          </div>
        </div>

        {/* Collapsible Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-white/20 bg-mcc-blue-dark">
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`
                    w-full justify-start text-left p-3 rounded-lg
                    ${item.active 
                      ? 'bg-white/20 text-white' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Content with Responsive Container */}
      <ResponsiveContainer>
        <div className="py-4 space-y-4 pb-20">
          {/* Default mobile dashboard content or children */}
          {children || (
            <>
              {/* Enhanced Heat Bar */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Behavior Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <MobileHeatBar 
                    score={6.2} 
                    previousScore={6.8} 
                    showTrend={true}
                  />
                </CardContent>
              </Card>
              
              {/* Enhanced Quick Actions */}
              <QuickActions userRole={user?.role || 'student'} />

              {/* Enhanced Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-red-600 text-sm font-bold">!</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Lateness to Class</p>
                        <p className="text-xs text-gray-600 mt-1">2 hours ago</p>
                      </div>
                      <Badge variant="destructive" className="text-xs shrink-0">
                        1st Offense
                      </Badge>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-green-600 text-sm font-bold">★</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Silver Merit Award</p>
                        <p className="text-xs text-gray-600 mt-1">Yesterday</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs shrink-0">
                        +2 pts
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ResponsiveContainer>

      {/* Enhanced Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="px-4 py-2">
          <div className="flex justify-around">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`
                  flex flex-col items-center gap-1 p-3 min-w-0 flex-1
                  ${item.active 
                    ? 'text-mcc-blue bg-blue-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;
