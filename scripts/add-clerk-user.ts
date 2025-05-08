// Script to manually add a Clerk user to the database
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

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
const db = drizzle(sql);

async function addClerkUser() {
  console.log("Adding Clerk user to database...");
  
  try {
    // Prompt for user input
    const clerkId = process.argv[2];
    const email = process.argv[3];
    const name = process.argv[4] || "User";
    
    if (!clerkId || !email) {
      console.error("Usage: npx tsx scripts/add-clerk-user.ts <clerk_id> <email> [name]");
      process.exit(1);
    }
    
    // Check if user already exists with this clerkId
    const existingUserByClerkId = await db.select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);
    
    if (existingUserByClerkId.length > 0) {
      console.log("User already exists with clerkId:", clerkId);
      console.log("User details:", existingUserByClerkId[0]);
      return { success: true, user: existingUserByClerkId[0] };
    }
    
    // Check if user already exists with this email
    const existingUserByEmail = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUserByEmail.length > 0) {
      console.log("User already exists with email:", email);
      console.log("User details:", existingUserByEmail[0]);
      
      // Update the user with the Clerk ID if it's missing
      if (!existingUserByEmail[0].clerkId) {
        const updatedUser = await db.update(users)
          .set({ clerkId, updatedAt: new Date() })
          .where(eq(users.email, email))
          .returning();
        
        console.log("Updated existing user with Clerk ID:", updatedUser[0]);
        return { success: true, user: updatedUser[0] };
      }
      
      return { success: true, user: existingUserByEmail[0] };
    }
    
    // Create new user in the database
    const newUser = await db.insert(users).values({
      clerkId,
      name,
      email,
      role: "admin", // Make the first manually added user an admin
      isActive: true,
    }).returning();
    
    console.log("User created successfully:", newUser[0]);
    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error("Error adding Clerk user:", error);
    return { success: false, error };
  }
}

// Execute the function
addClerkUser()
  .then((result) => {
    console.log("Script completed with result:", result.success ? "success" : "failure");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
