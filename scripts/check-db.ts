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

async function checkDatabase() {
  console.log("Checking database schema...");
  
  try {
    // Check if the users table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;
    
    console.log("Users table exists:", tableExists[0]?.exists);
    
    if (tableExists[0]?.exists) {
      // Check the columns in the users table
      const columns = await sql`
        SELECT column_name, data_type, column_default, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `;
      
      console.log("Users table columns:");
      for (const column of columns) {
        console.log(`- ${column.column_name}: ${column.data_type} (nullable: ${column.is_nullable}, default: ${column.column_default || 'none'})`);
      }
      
      // Check if any users exist
      const users = await sql`SELECT * FROM users;`;
      console.log(`Total users in database: ${users.length}`);
      
      if (users.length > 0) {
        console.log("Sample user:", users[0]);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error checking database:", error);
    return { success: false, error };
  }
}

// Execute the function
checkDatabase()
  .then(() => {
    console.log("Database check completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database check failed:", error);
    process.exit(1);
  });
