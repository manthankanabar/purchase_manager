'use client';

import { useEffect, useState } from 'react';

export default function ClerkDebug() {
  const [debugInfo, setDebugInfo] = useState<{
    publishableKey: string | null;
    keyLength: number | null;
    keyFormat: string | null;
  }>({
    publishableKey: null,
    keyLength: null,
    keyFormat: null
  });

  useEffect(() => {
    // Get the publishable key from environment
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
    
    // Create debug information
    setDebugInfo({
      publishableKey: key ? `${key.substring(0, 10)}...${key.substring(key.length - 5)}` : 'Not found',
      keyLength: key ? key.length : 0,
      keyFormat: key ? (key.startsWith('pk_test_') ? 'Starts with pk_test_' : 'Unknown format') : 'N/A'
    });
  }, []);

  return (
    <div className="p-4 border rounded-md bg-gray-50 my-4">
      <h2 className="text-lg font-bold mb-2">Clerk Debug Information</h2>
      <pre className="bg-gray-100 p-2 rounded">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
