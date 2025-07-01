import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProfileErrorHandler from './components/common/ProfileErrorHandler';

// Dashboard Components
import AdminDashboard from './components/dashboard/AdminDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import ParentDashboard from './components/dashboard/ParentDashboard';
import ShadowParentDashboard from './components/dashboard/ShadowParentDashboard';

// Auth Components
import LoginScreen from './components/auth/LoginScreen';

// Other Components
import NotFound from './pages/NotFound';
import ProfileErrorPage from './pages/ProfileErrorPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
          return false;
        }
        
        // Retry more times for profile-related queries
        if (error?.message?.includes('profile') || error?.message?.includes('student')) {
          return failureCount < 5; // More retries for profile issues
        }
        
        return failureCount < 3;
      },
      retryDelay: attemptIndex => {
        // Exponential backoff with jitter for more resilience
        const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000); // Max 30 seconds
        return baseDelay + Math.random() * 1000; // Add up to 1s of jitter
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const AppContent: React.FC = () => {
  const { user, isLoading, error, isPersistentError, handleProfileError } = useAuth();

  console.log('AppContent render - isLoading:', isLoading, 'user:', user?.email || 'undefined', 'role:', user?.role || 'undefined');

  if (error) {
    console.error('Auth error in AppContent:', error);
    
    // For persistent errors, we can redirect to the dedicated error page
    if (isPersistentError && handleProfileError) {
      handleProfileError();
    }
    
    return (
      <ProfileErrorHandler 
        error={error}
        title={error.includes('profile') ? 'Unable to Load Profile' : 'Authentication Error'}
        showErrorDetails={false}
        isPersistentError={isPersistentError}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, showing login screen');
    return <LoginScreen />;
  }

  console.log('User authenticated, routing to dashboard for role:', user.role);

  // Route based on user role
  const getDashboardComponent = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'shadow_parent':
        return <ShadowParentDashboard />;
      case 'counselor':
        return <AdminDashboard />; // Counselors use admin dashboard with restricted access
      default:
        console.warn('Unknown user role:', user.role);
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Access Error</h2>
              <p className="text-gray-600 mb-4">
                Your account role ({user.role}) is not recognized. Please contact your administrator.
              </p>
              <p className="text-sm text-gray-500">User: {user.email}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Routes>
      <Route path="/" element={getDashboardComponent()} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/profile-error" element={<ProfileErrorPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  console.log('App component rendered');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppContent />
            <Toaster />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
