'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

// Mock user data
const mockUser = {
  id: 'dev-user-123',
  firstName: 'Dev',
  lastName: 'User',
  fullName: 'Dev User',
  username: 'devuser',
  primaryEmailAddress: 'dev@example.com',
  imageUrl: 'https://via.placeholder.com/150',
};

// Mock SignIn component
export function SignInButton({ 
  mode = 'redirect', 
  children,
  ...props 
}: { 
  mode?: 'modal' | 'redirect',
  children: React.ReactNode,
  [key: string]: any
}) {
  const router = useRouter();
  
  const handleClick = () => {
    if (mode === 'redirect') {
      router.push('/dashboard');
    }
    // For modal mode, we'd normally show a modal, but for mocking we'll just redirect
    else {
      router.push('/dashboard');
    }
  };
  
  return (
    <div onClick={handleClick} {...props}>
      {children}
    </div>
  );
}

// Mock SignUp component
export function SignUpButton({ 
  mode = 'redirect', 
  children,
  ...props 
}: { 
  mode?: 'modal' | 'redirect',
  children: React.ReactNode,
  [key: string]: any
}) {
  const router = useRouter();
  
  const handleClick = () => {
    if (mode === 'redirect') {
      router.push('/dashboard');
    }
    // For modal mode, we'd normally show a modal, but for mocking we'll just redirect
    else {
      router.push('/dashboard');
    }
  };
  
  return (
    <div onClick={handleClick} {...props}>
      {children}
    </div>
  );
}

// Mock SignedIn component
export function SignedIn({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Mock SignedOut component
export function SignedOut({ children }: { children: React.ReactNode }) {
  // In development mode, we'll hide SignedOut content since we're mocking as signed in
  return null;
}

// Mock UserButton component
export function UserButton({ 
  afterSignOutUrl = '/',
  ...props 
}: { 
  afterSignOutUrl?: string,
  [key: string]: any
}) {
  const router = useRouter();
  
  return (
    <div className="flex items-center gap-2 cursor-pointer" {...props}>
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        <img 
          src={mockUser.imageUrl} 
          alt={mockUser.fullName} 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-sm font-medium">{mockUser.fullName}</span>
    </div>
  );
}

// Mock auth function
export function auth() {
  return {
    userId: mockUser.id,
    sessionId: 'mock-session-123',
    getToken: async () => 'mock-token-xyz',
  };
}

// Mock currentUser function
export function currentUser() {
  return mockUser;
}

// Mock useAuth hook
export function useAuth() {
  return {
    isLoaded: true,
    isSignedIn: true,
    userId: mockUser.id,
    sessionId: 'mock-session-123',
    getToken: async () => 'mock-token-xyz',
  };
}

// Mock useUser hook
export function useUser() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: mockUser,
  };
}
