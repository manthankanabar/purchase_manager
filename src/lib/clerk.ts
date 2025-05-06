// Clerk configuration
export const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable');
}

if (!clerkSecretKey) {
  throw new Error('Missing CLERK_SECRET_KEY environment variable');
}
