import { useState, useEffect } from 'react';

interface UseProfileErrorHandlerOptions {
  /**
   * Initial error state
   */
  initialError?: Error | string | null;
  
  /**
   * Maximum number of errors before considering it a persistent error
   */
  maxErrorCount?: number;
  
  /**
   * Whether to automatically track error count in sessionStorage
   */
  trackInSession?: boolean;
  
  /**
   * Key to use for storing error count in sessionStorage
   */
  storageKey?: string;
}

interface UseProfileErrorHandlerResult {
  /**
   * Current error state
   */
  error: Error | string | null;
  
  /**
   * Set a new error
   */
  setError: (error: Error | string | null) => void;
  
  /**
   * Current error count
   */
  errorCount: number;
  
  /**
   * Whether the error is considered persistent (exceeded maxErrorCount)
   */
  isPersistentError: boolean;
  
  /**
   * Reset error count and clear error
   */
  resetError: () => void;
  
  /**
   * Clear session storage and local storage auth tokens
   */
  clearAuthStorage: () => void;
}

/**
 * Custom hook for handling profile loading errors consistently across the application.
 * Tracks error count, determines if errors are persistent, and provides utilities for
 * error management and storage cleanup.
 */
export function useProfileErrorHandler({
  initialError = null,
  maxErrorCount = 3,
  trackInSession = true,
  storageKey = 'profileErrorCount'
}: UseProfileErrorHandlerOptions = {}): UseProfileErrorHandlerResult {
  const [error, setErrorState] = useState<Error | string | null>(initialError);
  const [errorCount, setErrorCount] = useState<number>(() => {
    if (trackInSession) {
      return parseInt(sessionStorage.getItem(storageKey) || '0', 10);
    }
    return 0;
  });

  // Update session storage when error count changes
  useEffect(() => {
    if (trackInSession && errorCount > 0) {
      sessionStorage.setItem(storageKey, errorCount.toString());
    }
  }, [errorCount, storageKey, trackInSession]);

  // Increment error count when a new error is set
  const setError = (newError: Error | string | null) => {
    if (newError) {
      setErrorCount(prev => prev + 1);
    }
    setErrorState(newError);
  };

  // Reset error state and count
  const resetError = () => {
    setErrorState(null);
    setErrorCount(0);
    if (trackInSession) {
      sessionStorage.removeItem(storageKey);
    }
  };

  // Clear all auth-related storage
  const clearAuthStorage = () => {
    sessionStorage.clear();
    localStorage.removeItem('supabase.auth.token');
  };

  return {
    error,
    setError,
    errorCount,
    isPersistentError: errorCount >= maxErrorCount,
    resetError,
    clearAuthStorage
  };
}