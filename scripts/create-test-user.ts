// Load environment variables first, before any other imports
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Log environment variables for debugging
console.log("Environment variables loaded:");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("CLERK_WEBHOOK_SECRET exists:", !!process.env.CLERK_WEBHOOK_SECRET);

// Directly create database connection instead of importing
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_INaFirSQ6zp9@ep-billowing-boat-a4s5ij5l-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Create a neon client
const sql = neon(DATABASE_URL);

// Create a drizzle client
const db = drizzle(sql);

// Import schema
import { users } from "../src/db/schema";

async function createTestUser() {
  console.log("Creating test user...");
  
  try {
    // Create a test user
    const newUser = await db.insert(users).values({
      clerkId: "test-clerk-id-" + Date.now(),
      name: "Test User",
      email: `test-user-${Date.now()}@example.com`,
      role: "user",
      isActive: true,
    }).returning();
    
    console.log("Test user created successfully:", newUser);
    
    // Query all users to verify
    const allUsers = await db.select().from(users);
    console.log(`Total users in database: ${allUsers.length}`);
    console.log("All users:", allUsers);
    
    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error("Error creating test user:", error);
    return { success: false, error };
  }
}

// Execute the function
createTestUser()
  .then(() => {
    console.log("Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
