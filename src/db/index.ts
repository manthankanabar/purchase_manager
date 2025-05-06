import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Check if the DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a neon client with proper type casting
const sql = neon(process.env.DATABASE_URL) as NeonQueryFunction<any, any>;

// Create a drizzle client
export const db = drizzle(sql);
