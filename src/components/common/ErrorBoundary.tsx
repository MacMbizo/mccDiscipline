
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileErrorHandler from './ProfileErrorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Log specific error types for better debugging
    if (error.message.includes('profile') || error.message.includes('student')) {
      console.warn('Profile loading error detected. This may be a temporary network issue.');
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  isProfileError = () => {
    return this.state.error && 
      (this.state.error.message.includes('profile') || 
       this.state.error.message.includes('student') ||
       this.state.error.message.includes('Unable to load'));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use ProfileErrorHandler for profile-related errors
      if (this.isProfileError() && this.state.error) {
        // Get error count from session storage to determine if it's persistent
        const errorCount = parseInt(sessionStorage.getItem('profileErrorCount') || '0');
        sessionStorage.setItem('profileErrorCount', (errorCount + 1).toString());
        const isPersistentError = errorCount >= 3;
        
        // For persistent errors, redirect to the dedicated error page
        if (isPersistentError) {
          window.location.href = '/profile-error';
          return null;
        }
        
        return (
          <ProfileErrorHandler 
            error={this.state.error}
            onRetry={this.handleReset}
            title="Unable to Load Profile"
          />
        );
      }

      // Default error UI for non-profile errors
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-red-800">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              
              {this.state.error && (
                <details className="bg-gray-100 p-3 rounded text-sm">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button onClick={this.handleReset} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
