'use client';

import { useEffect, useState } from 'react';

interface ClerkProviderProps {
  children: React.ReactNode;
}

// Development-only mock for Clerk authentication
const MockClerkContext = {
  isSignedIn: true,
  user: {
    id: 'dev-user-123',
    firstName: 'Dev',
    lastName: 'User',
    fullName: 'Dev User',
    username: 'devuser',
    primaryEmailAddress: 'dev@example.com',
    imageUrl: 'https://via.placeholder.com/150',
  },
  session: {
    id: 'dev-session-123',
    status: 'active',
  },
};

// Create a mock version of Clerk's context
export function CustomClerkProvider({ children }: ClerkProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // In development mode, we'll use a mock implementation
  if (process.env.NODE_ENV === 'development') {
    // Mock the Clerk global object for development
    if (typeof window !== 'undefined') {
      (window as any).Clerk = {
        isReady: () => true,
        user: MockClerkContext.user,
        session: MockClerkContext.session,
      };
    }
    
    if (isLoading) {
      return <div className="p-4">Loading authentication...</div>;
    }
    
    return (
      <div data-clerk-mock-provider="true">
        {children}
      </div>
    );
  }
  
  // In production, we would use the real ClerkProvider
  // But for now, show an error message since we're having issues
  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
      <h2 className="text-lg font-bold">Authentication Disabled</h2>
      <p>Authentication is currently disabled while we resolve Clerk integration issues.</p>
      <p className="mt-2 text-sm">
        This is a temporary development mode. Please contact the administrator to enable authentication.
      </p>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}
