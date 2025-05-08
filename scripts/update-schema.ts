// Load environment variables first
import * as dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_INaFirSQ6zp9@ep-billowing-boat-a4s5ij5l-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(DATABASE_URL);

async function updateSchema() {
  console.log("Checking database schema...");
  
  try {
    // First, check if the users table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;
    
    const usersTableExists = tableExists[0]?.exists;
    console.log("Users table exists:", usersTableExists);
    
    // Get all existing columns in the users table
    let existingColumns = [];
    
    if (usersTableExists) {
      const columnsResult = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `;
      
      existingColumns = columnsResult.map(row => row.column_name);
      console.log("Existing columns in users table:", existingColumns);
    } else {
      console.log("Creating users table from scratch...");
      
      // Create the users table if it doesn't exist
      await sql`
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
      `;
      
      console.log("Users table created successfully!");
      return { success: true };
    }
    
    // Check and add missing columns
    const requiredColumns = [
      { name: 'clerk_id', definition: 'TEXT UNIQUE' },
      { name: 'is_active', definition: 'BOOLEAN NOT NULL DEFAULT TRUE' },
      { name: 'role', definition: "TEXT NOT NULL DEFAULT 'user'" },
      { name: 'entity_id', definition: 'UUID' },
      { name: 'created_at', definition: 'TIMESTAMP DEFAULT NOW()' },
      { name: 'updated_at', definition: 'TIMESTAMP DEFAULT NOW()' }
    ];
    
    for (const column of requiredColumns) {
      if (!existingColumns.includes(column.name)) {
        console.log(`Adding ${column.name} column to users table...`);
        
        await sql`
          ALTER TABLE users 
          ADD COLUMN ${column.name} ${column.definition}
        `;
        
        console.log(`${column.name} column added successfully!`);
      }
    }
    
    // Verify the updated schema
    const updatedColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    
    console.log("Updated columns in users table:", updatedColumns.map(row => row.column_name));
    
    return { success: true };
  } catch (error) {
    console.error("Error updating schema:", error);
    return { success: false, error };
  }
}

// Execute the function
updateSchema()
  .then((result) => {
    console.log("Schema update completed with result:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Schema update failed:", error);
    process.exit(1);
  });
