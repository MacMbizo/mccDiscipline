
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, User } from '@/types/auth';
import { useProfileErrorHandler } from '@/hooks/useProfileErrorHandler';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the profile error handler for consistent error management
  const { 
    error, 
    setError, 
    resetError, 
    isPersistentError,
    clearAuthStorage 
  } = useProfileErrorHandler({
    maxErrorCount: 3,
    trackInSession: true
  });

  console.log('AuthProvider initializing...');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      resetError();

      if (session?.user) {
        // Defer profile fetching to avoid deadlocks
        setTimeout(async () => {
          const fetchProfileWithRetry = async (retries = 3, delay = 1000) => {
            try {
              console.log('Fetching profile for user:', session.user.id, session.user.email);
              
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profileError) {
                console.error('Profile fetch error:', profileError);
                if (retries > 0) {
                  console.log(`Retrying profile fetch. Attempts remaining: ${retries}`);
                  setTimeout(() => fetchProfileWithRetry(retries - 1, delay * 1.5), delay);
                  return;
                }
                setError('Failed to load user profile');
                setUser(null);
              } else if (profile) {
                console.log('Profile loaded:', profile);
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: profile.name,
                  role: profile.role as User['role'],
                  profileImage: profile.profile_image,
                  lastLogin: profile.last_login ? new Date(profile.last_login) : undefined,
                  isActive: profile.is_active
                });
              } else {
                console.warn('No profile found for user');
                if (retries > 0) {
                  console.log(`Retrying profile fetch. Attempts remaining: ${retries}`);
                  setTimeout(() => fetchProfileWithRetry(retries - 1, delay * 1.5), delay);
                  return;
                }
                setUser(null);
                setError('User profile not found');
              }
            } catch (err) {
              console.error('Error fetching profile:', err);
              setError('Failed to load user data');
              setUser(null);
            } finally {
              setIsLoading(false);
            }
          };
          
          // Start the profile fetch with retry
          fetchProfileWithRetry();
          
          // Update last login timestamp
          try {
            await supabase
              .from('profiles')
              .update({ last_login: new Date().toISOString() })
              .eq('id', session.user.id);
          } catch (updateErr) {
            console.warn('Failed to update last login time:', updateErr);
            // Non-critical error, don't need to handle it further
          }
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setError(error.message);
        setIsLoading(false);
      } else if (!session) {
        console.log('No initial session found');
        setIsLoading(false);
      }
      // If session exists, onAuthStateChange will handle it
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    resetError();
    
    try {
      // Clear any previous auth tokens to ensure a fresh login
      clearAuthStorage();
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; role: string }): Promise<void> => {
    setIsLoading(true);
    resetError();
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
          },
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Clear any error tracking and session data
      clearAuthStorage();
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      resetError();
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
      
      // Even if there's an error, still clear the local state
      setUser(null);
      setSession(null);
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Method to handle persistent profile errors by redirecting to the error page
  const handleProfileError = () => {
    if (isPersistentError && error) {
      window.location.href = '/profile-error';
    }
  };

  // Check for persistent errors that require redirection
  useEffect(() => {
    if (isPersistentError && error && !isLoading) {
      handleProfileError();
    }
  }, [isPersistentError, error, isLoading]);

  const value: AuthContextType = {
    user,
    login,
    signUp,
    logout,
    isLoading,
    error,
    isPersistentError,
    handleProfileError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
