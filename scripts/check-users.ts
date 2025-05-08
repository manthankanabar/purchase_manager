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

async function checkUsers() {
  console.log("Checking users in database...");
  
  try {
    // Check if any users exist
    const users = await sql`SELECT * FROM users;`;
    console.log(`Total users in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log("Users found:");
      users.forEach((user, index) => {
        console.log(`User ${index + 1}:`, user);
      });
    } else {
      console.log("No users found in the database.");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error checking users:", error);
    return { success: false, error };
  }
}

// Execute the function
checkUsers()
  .then(() => {
    console.log("User check completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("User check failed:", error);
    process.exit(1);
  });
