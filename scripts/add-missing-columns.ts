// Load environment variables first
import * as dotenv from "dotenv";
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

const sql = neon(DATABASE_URL);

async function addMissingColumns() {
  console.log("Adding missing columns to users table...");
  
  try {
    // Check if is_active column exists
    const isActiveExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_active'
      );
    `;
    
    if (!isActiveExists[0]?.exists) {
      console.log("Adding is_active column...");
      await sql`ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;`;
      console.log("is_active column added successfully");
    } else {
      console.log("is_active column already exists");
    }
    
    // Check if updated_at column exists
    const updatedAtExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'updated_at'
      );
    `;
    
    if (!updatedAtExists[0]?.exists) {
      console.log("Adding updated_at column...");
      await sql`ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();`;
      console.log("updated_at column added successfully");
    } else {
      console.log("updated_at column already exists");
    }
    
    // Verify the updated schema
    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;
    
    console.log("Updated users table columns:");
    for (const column of columns) {
      console.log(`- ${column.column_name}: ${column.data_type}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error adding missing columns:", error);
    return { success: false, error };
  }
}

// Execute the function
addMissingColumns()
  .then(() => {
    console.log("Column addition completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Column addition failed:", error);
    process.exit(1);
  });
