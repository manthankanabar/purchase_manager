import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function main() {
  console.log('Connecting to database...');
  
  try {
    // Create a neon client
    const sql = neon(process.env.DATABASE_URL!);
    
    // Create a drizzle client
    const db = drizzle(sql);
    
    // Run migrations
    console.log('Running migrations...');
    
    // Path to the migrations folder (relative to this script)
    const migrationsFolder = resolve(__dirname, '../src/db/migrations');
    
    await migrate(db, { migrationsFolder });
    
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  }
}

main();
