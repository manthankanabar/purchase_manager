// This is a Next.js page component to display the current user's Clerk information
// Save this file to src/app/debug/page.tsx and then visit /debug in your browser

import { currentUser } from "@clerk/nextjs/server";

export default async function DebugPage() {
  const user = await currentUser();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Current User Debug Info</h1>
      
      {user ? (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">User Found</h2>
          <pre className="bg-white p-4 rounded overflow-auto max-w-full">
            {JSON.stringify(
              {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddresses: user.emailAddresses,
                imageUrl: user.imageUrl,
              },
              null,
              2
            )}
          </pre>
          
          <div className="mt-4 p-4 bg-yellow-100 rounded">
            <h3 className="font-semibold">Instructions:</h3>
            <p>Use this information to add your user to the database with the following command:</p>
            <div className="bg-black text-white p-2 rounded mt-2 overflow-x-auto">
              <code>
                npx tsx scripts/add-clerk-user.ts {user.id} {user.emailAddresses[0]?.emailAddress} "{user.firstName} {user.lastName}"
              </code>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">No User Found</h2>
          <p>You are not currently signed in with Clerk.</p>
        </div>
      )}
    </div>
  );
}
