/**
 * Mock implementation of Clerk's server-side authentication functions
 * This is used in development mode to bypass Clerk authentication issues
 */

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

/**
 * Mock implementation of getAuth for server-side usage
 * Always returns a mock user ID in development mode
 */
export function getAuth() {
  return {
    userId: mockUser.id,
    sessionId: 'mock-session-123',
    getToken: async () => 'mock-token-xyz',
  };
}

/**
 * Mock implementation of currentUser for server-side usage
 * Always returns a mock user in development mode
 */
export function currentUser() {
  return mockUser;
}

/**
 * Mock implementation of auth for server-side usage
 * Always returns a function that provides mock authentication
 */
export function auth() {
  return {
    protect: () => ({ userId: mockUser.id }),
    userId: mockUser.id,
    sessionId: 'mock-session-123',
  };
}
