// Load environment variables first
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Database connection
const DATABASE_URL = process.env.DATABASE_URL;
console.log("DATABASE_URL exists:", !!DATABASE_URL);

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const neonClient = neon(DATABASE_URL);
const db = drizzle(neonClient);

async function fixUsersTable() {
  console.log("Fixing users table...");
  
  try {
    // Check if the users table exists
    const tableExists = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    const usersTableExists = tableExists[0]?.exists === true;
    console.log("Users table exists:", usersTableExists);
    
    if (usersTableExists) {
      // Drop the existing users table
      console.log("Dropping existing users table...");
      await db.execute(`DROP TABLE IF EXISTS users CASCADE;`);
      console.log("Users table dropped successfully");
    }
    
    // Create the users table with the correct schema
    console.log("Creating users table with correct schema...");
    await db.execute(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_id TEXT UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'user',
        entity_id UUID,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log("Users table created successfully!");
    
    // Verify the table structure
    const columns = await db.execute(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    
    console.log("Users table columns:");
    for (const column of columns) {
      console.log(`- ${column.column_name}: ${column.data_type}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error fixing users table:", error);
    return { success: false, error };
  }
}

// Execute the function
fixUsersTable()
  .then((result) => {
    console.log("Fix completed with result:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fix failed:", error);
    process.exit(1);
  });
