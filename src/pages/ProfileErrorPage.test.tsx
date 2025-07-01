import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileErrorPage from './ProfileErrorPage';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the useProfileErrorHandler hook
jest.mock('@/hooks/useProfileErrorHandler', () => ({
  useProfileErrorHandler: jest.fn().mockImplementation(({ initialError }) => ({
    error: initialError || 'Test error',
    isPersistentError: false,
    resetError: jest.fn(),
    clearAuthStorage: jest.fn(),
  })),
}));

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  ...jest.requireActual('@/contexts/AuthContext'),
  useAuth: jest.fn().mockImplementation(() => ({
    logout: jest.fn(),
  })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ProfileErrorPage', () => {
  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <ProfileErrorPage 
          error="Test error message" 
          title="Test Error Title"
          {...props} 
        />
      </BrowserRouter>
    );
  };

  it('renders the error page with correct title', () => {
    renderComponent();
    expect(screen.getByText('Test Error Title')).toBeInTheDocument();
  });

  it('displays error details when showErrorDetails is true', () => {
    renderComponent({ showErrorDetails: true });
    expect(screen.getByText('Error Details')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('hides error details when showErrorDetails is false', () => {
    renderComponent({ showErrorDetails: false });
    expect(screen.queryByText('Error Details')).not.toBeInTheDocument();
  });

  it('shows different message for persistent errors', () => {
    const { useProfileErrorHandler } = require('@/hooks/useProfileErrorHandler');
    useProfileErrorHandler.mockImplementationOnce(({ initialError }) => ({
      error: initialError || 'Test error',
      isPersistentError: true,
      resetError: jest.fn(),
      clearAuthStorage: jest.fn(),
    }));

    renderComponent();
    expect(screen.getByText(/We're having trouble loading your profile/)).toBeInTheDocument();
  });

  it('shows different message for temporary errors', () => {
    renderComponent();
    expect(screen.getByText(/This is often a temporary issue/)).toBeInTheDocument();
  });

  it('calls onRetry when Try Again button is clicked', () => {
    const onRetry = jest.fn();
    renderComponent({ onRetry });
    
    fireEvent.click(screen.getByText('Try Again'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('calls window.location.reload when Refresh Page button is clicked', () => {
    const originalReload = window.location.reload;
    window.location.reload = jest.fn();
    
    renderComponent();
    fireEvent.click(screen.getByText('Refresh Page'));
    
    expect(window.location.reload).toHaveBeenCalled();
    window.location.reload = originalReload;
  });
});