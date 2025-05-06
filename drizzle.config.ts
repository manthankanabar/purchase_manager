import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  // Use the connectionString format for Neon DB
  dbCredentials: {
    // Parse the connection string to extract individual credentials
    connectionString: process.env.DATABASE_URL || '',
  },
} as Config;
