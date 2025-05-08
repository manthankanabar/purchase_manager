import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware((auth, req) => {
  // Check if the request is for the webhook route
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/webhooks/clerk')) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};