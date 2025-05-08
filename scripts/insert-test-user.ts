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

async function insertTestUser() {
  console.log("Inserting test user...");
  
  try {
    // First, let's check what columns actually exist in the users table
    const columns = await db.execute(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    
    console.log("Users table columns:");
    const columnNames = [];
    for (const column of columns) {
      console.log(`- ${column.column_name}: ${column.data_type}`);
      columnNames.push(column.column_name);
    }
    
    // Now let's insert a user with only the columns that exist
    console.log("Inserting user with available columns...");
    
    // Build the insert query dynamically based on available columns
    const values = {};
    
    // Always include these basic fields if they exist
    if (columnNames.includes('name')) values['name'] = 'Test User';
    if (columnNames.includes('email')) values['email'] = `test-${Date.now()}@example.com`;
    
    // Add clerk_id if it exists
    if (columnNames.includes('clerk_id')) {
      values['clerk_id'] = `test-clerk-id-${Date.now()}`;
    }
    
    // Add role if it exists
    if (columnNames.includes('role')) {
      values['role'] = 'user';
    }
    
    // Add is_active if it exists
    if (columnNames.includes('is_active')) {
      values['is_active'] = true;
    }
    
    // Construct the SQL query
    const columns = Object.keys(values).join(', ');
    const placeholders = Object.keys(values).map((_, i) => `$${i + 1}`).join(', ');
    const valuesArray = Object.values(values);
    
    const insertQuery = `
      INSERT INTO users (${columns})
      VALUES (${placeholders})
      RETURNING *;
    `;
    
    console.log("Insert query:", insertQuery);
    console.log("Values:", valuesArray);
    
    const result = await db.execute(insertQuery, valuesArray);
    
    console.log("User inserted successfully:", result[0]);
    
    // Query all users to verify
    const allUsers = await db.execute(`SELECT * FROM users;`);
    console.log(`Total users in database: ${allUsers.length}`);
    
    return { success: true, user: result[0] };
  } catch (error) {
    console.error("Error inserting test user:", error);
    return { success: false, error };
  }
}

// Execute the function
insertTestUser()
  .then((result) => {
    console.log("Insert completed with result:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Insert failed:", error);
    process.exit(1);
  });
