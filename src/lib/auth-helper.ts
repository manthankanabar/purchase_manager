/**
 * Authentication helper that provides either real Clerk authentication
 * or mock authentication based on the environment
 */

// Import mock authentication for development
import * as mockAuth from './clerk-server-mocks';

// Conditionally import real authentication for production
let realAuth: any = {};

// Only import real Clerk authentication in production
if (process.env.NODE_ENV !== 'development') {
  try {
    // Dynamic import to avoid Clerk errors in development
    realAuth = require('@clerk/nextjs/server');
  } catch (error) {
    console.warn('Failed to import Clerk authentication. Using mock authentication instead.');
  }
}

// Export the appropriate authentication functions based on environment
export const getAuth = process.env.NODE_ENV === 'development' 
  ? mockAuth.getAuth 
  : realAuth.getAuth;

export const auth = process.env.NODE_ENV === 'development'
  ? mockAuth.auth
  : realAuth.auth;

export const currentUser = process.env.NODE_ENV === 'development'
  ? mockAuth.currentUser
  : realAuth.currentUser;
