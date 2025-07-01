import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileErrorHandlerProps {
  error: Error | string | null;
  onRetry?: () => void;
  onRefresh?: () => void;
  onLogout?: () => void;
  title?: string;
  showErrorDetails?: boolean;
  className?: string;
  isPersistentError?: boolean;
}

/**
 * A standardized component for handling profile loading errors across the application.
 * Provides consistent UI and behavior for profile-related errors.
 */
const ProfileErrorHandler: React.FC<ProfileErrorHandlerProps> = ({
  error,
  onRetry,
  onRefresh = () => window.location.reload(),
  onLogout,
  title = 'Unable to Load Profile',
  showErrorDetails = true,
  className = '',
  isPersistentError: propIsPersistentError,
}) => {
  if (!error) return null;
  
  // Track error attempts in session storage if not explicitly provided via props
  let errorCount = 0;
  let isPersistentError = !!propIsPersistentError;
  
  if (propIsPersistentError === undefined) {
    errorCount = parseInt(sessionStorage.getItem('profileErrorCount') || '0');
    sessionStorage.setItem('profileErrorCount', (errorCount + 1).toString());
    
    // Determine if this is a persistent error (3 or more attempts)
    isPersistentError = errorCount >= 3;
  }
  
  // Handle logout and cleanup
  const handleLogout = () => {
    // Clear error tracking
    sessionStorage.clear();
    localStorage.removeItem('supabase.auth.token');
    
    // Call provided logout handler or redirect
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/';
    }
  };
  
  // Handle retry with cleanup
  const handleRetry = () => {
    // Reset error count on manual retry
    sessionStorage.setItem('profileErrorCount', '0');
    
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-800">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            {isPersistentError
              ? 'We\'re having trouble loading your profile. This may be due to a network issue or server problem.'
              : 'There was an issue loading your profile. This is often a temporary issue that resolves itself after refreshing.'}
          </p>
          
          {showErrorDetails && error && (
            <details className="bg-gray-100 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {error instanceof Error ? error.message : error}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button 
                onClick={handleRetry}
                variant="outline"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Try Again
              </Button>
            )}
            <Button 
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </Button>
            <Button 
              onClick={handleLogout}
              variant="secondary"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Return to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileErrorHandler;