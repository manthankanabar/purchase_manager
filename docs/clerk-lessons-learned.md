# Clerk Authentication: Lessons Learned

## Overview

This document outlines key lessons learned during the implementation of Clerk authentication in our Purchase Manager application. These insights should help future developers avoid common pitfalls and implement Clerk more effectively.

## Implementation Challenges and Solutions

### 1. Middleware Configuration

**Challenge:** The initial middleware implementation didn't properly protect routes and had incorrect imports.

**Solution:** 
- Use the correct import path: `import { clerkMiddleware } from '@clerk/nextjs/server'`
- Implement both `beforeAuth` and `afterAuth` handlers
- Properly check for public routes before redirecting

**Correct Implementation:**
```typescript
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/api/webhook', '/sign-in', '/sign-up'];

export default clerkMiddleware({
  beforeAuth: (req) => {
    return NextResponse.next();
  },
  afterAuth: (auth, req) => {
    // If the user is not signed in and the route is not public, redirect to sign-in
    if (!auth.userId && !publicRoutes.includes(req.nextUrl.pathname)) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### 2. Conditional Rendering Based on Authentication State

**Challenge:** The application was trying to show sign-in modals to already authenticated users, causing errors.

**Solution:**
- Use Clerk's `<SignedIn>` and `<SignedOut>` components to conditionally render UI elements
- Only show sign-in/sign-up buttons to unauthenticated users
- Show dashboard links and user profile buttons to authenticated users

**Example:**
```tsx
<div className="flex items-center space-x-4">
  <SignedOut>
    <SignInButton mode="modal">
      <Button variant="ghost">Sign In</Button>
    </SignInButton>
    <SignUpButton mode="modal">
      <Button>Get Started</Button>
    </SignUpButton>
  </SignedOut>
  <SignedIn>
    <Link href="/dashboard">
      <Button variant="ghost">Dashboard</Button>
    </Link>
    <UserButton afterSignOutUrl="/" />
  </SignedIn>
</div>
```

### 3. Sign-In Button Configuration

**Challenge:** Using incorrect props on the `SignInButton` component caused TypeScript errors.

**Solution:**
- Remove the invalid `redirectUrl` prop
- Use the correct mode prop (`modal` or `redirect`)
- Ensure proper button nesting

**Correct Usage:**
```tsx
<SignInButton mode="redirect">
  <Button size="lg">Go to Dashboard</Button>
</SignInButton>
```

### 4. Environment Variables

**Important:** Ensure these environment variables are properly set:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Best Practices

1. **Public Routes:** Always define public routes explicitly in the middleware
2. **Conditional Rendering:** Always use `<SignedIn>` and `<SignedOut>` components to conditionally render UI
3. **User Button:** Use the `<UserButton>` component for user profile management
4. **Redirect Handling:** Set appropriate redirect URLs after sign-in/sign-out
5. **API Protection:** Implement specific handling for API routes to return proper status codes

## Common Errors

1. **ClerkRuntimeError: cannot_render_single_session_enabled**
   - Cause: Trying to show sign-in/sign-up modals to already authenticated users
   - Solution: Use `<SignedOut>` to conditionally render authentication components

2. **Module has no exported member 'authMiddleware'**
   - Cause: Using incorrect import paths or outdated Clerk documentation
   - Solution: Check the correct imports for your specific Clerk version

3. **Type errors with Clerk components**
   - Cause: Using props that don't exist or have been renamed
   - Solution: Refer to the latest Clerk TypeScript definitions or documentation

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Authentication Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components Reference](https://clerk.com/docs/components/overview)

## Version Information

This implementation was done with:
- Next.js 15.3.1
- @clerk/nextjs 6.18.5
