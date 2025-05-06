'use client';

// Import the mock SignIn component for development mode
import { MockSignIn } from '@/lib/clerk-sign-in-mock';

// Use the mock component in development mode
const SignIn = MockSignIn;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Sign in to your account to access the purchase management system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignIn />
        </CardContent>
      </Card>
    </div>
  );
}
