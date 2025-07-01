import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfileErrorHandler } from '@/hooks/useProfileErrorHandler';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileErrorPageProps {
  error?: Error | string | null;
  title?: string;
  showErrorDetails?: boolean;
  onRetry?: () => void;
}

/**
 * A dedicated page component for displaying profile loading errors.
 * Can be used as a standalone page or embedded in other components.
 */
const ProfileErrorPage: React.FC<ProfileErrorPageProps> = ({
  error: initialError,
  title = 'Unable to Load Profile',
  showErrorDetails = true,
  onRetry,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { 
    error, 
    isPersistentError, 
    resetError,
    clearAuthStorage 
  } = useProfileErrorHandler({
    initialError,
    maxErrorCount: 3,
    trackInSession: true
  });

  if (!error) {
    // If no error, redirect to home
    navigate('/');
    return null;
  }

  const handleRetry = () => {
    resetError();
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    resetError();
    clearAuthStorage();
    if (logout) {
      logout();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.reload()}
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

export default ProfileErrorPage;