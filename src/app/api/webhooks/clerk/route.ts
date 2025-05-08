import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUserAction, updateUserAction, deleteUserAction } from '@/lib/actions/user-webhook-actions';

// Environment variable for the webhook secret
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

/**
 * Handle user.created event
 * Inserts a new user record into our database
 */
async function handleUserCreated(data: any) {
  try {
    console.log('User created event received:', JSON.stringify(data, null, 2));
    const result = await createUserAction(data);
    if (result.success) {
      console.log('User created successfully in database:', result.user);
    } else {
      console.error('Failed to create user in database:', result.error);
    }
    return result;
  } catch (error) {
    console.error('Error handling user.created event:', error);
    return { success: false, error };
  }
}

/**
 * Handle user.updated event
 * Updates an existing user record in our database
 */
async function handleUserUpdated(data: any) {
  try {
    console.log('User updated event received:', JSON.stringify(data, null, 2));
    const result = await updateUserAction(data);
    if (result.success) {
      console.log('User updated successfully in database:', result.user);
    } else {
      console.error('Failed to update user in database:', result.error);
    }
    return result;
  } catch (error) {
    console.error('Error handling user.updated event:', error);
    return { success: false, error };
  }
}

/**
 * Handle user.deleted event
 * Marks a user as inactive or removes them from our database
 */
async function handleUserDeleted(data: any) {
  try {
    console.log('User deleted event received:', JSON.stringify(data, null, 2));
    const result = await deleteUserAction(data);
    if (result.success) {
      console.log('User marked as inactive in database:', result.user);
    } else {
      console.error('Failed to mark user as inactive in database:', result.error);
    }
    return result;
  } catch (error) {
    console.error('Error handling user.deleted event:', error);
    return { success: false, error };
  }
}

/**
 * Webhook handler for Clerk authentication events
 * This endpoint receives events when users are created, updated, or deleted in Clerk
 */
export async function POST(req: Request) {
  console.log('Webhook endpoint called');
  
  // Verify the webhook signature
  // Get the headers from the request instead of using the headers() function
  const svixId = req.headers.get('svix-id') || '';
  const svixTimestamp = req.headers.get('svix-timestamp') || '';
  const svixSignature = req.headers.get('svix-signature') || '';

  // Log the headers for debugging
  console.log('Webhook headers:', {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature ? 'present' : 'missing',
    'webhook-secret': webhookSecret ? 'present' : 'missing'
  });

  // If there's no webhook secret or missing headers, return an error
  if (!webhookSecret || !svixId || !svixTimestamp || !svixSignature) {
    console.error('Missing Clerk webhook secret or required headers');
    return Response.json(
      { error: 'Missing webhook secret or required headers' },
      { status: 400 }
    );
  }

  // Get the raw body
  const payload = await req.text();
  console.log('Webhook payload received:', payload.substring(0, 200) + '...');
  
  // Create a new Svix instance with our webhook secret
  const wh = new Webhook(webhookSecret);
  
  let evt: WebhookEvent;
  
  try {
    // Verify the signature
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
    console.log('Webhook signature verified successfully');
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return Response.json(
      { error: 'Error verifying webhook' },
      { status: 400 }
    );
  }

  // Handle the webhook event based on type
  const eventType = evt.type;
  
  console.log(`Received webhook event: ${eventType}`);
  
  switch (eventType) {
    case 'user.created':
      await handleUserCreated(evt.data);
      break;
    case 'user.updated':
      await handleUserUpdated(evt.data);
      break;
    case 'user.deleted':
      await handleUserDeleted(evt.data);
      break;
    default:
      console.log(`Unhandled webhook event type: ${eventType}`);
  }

  // Return a 200 response to acknowledge receipt of the webhook
  return Response.json({ success: true });
}
