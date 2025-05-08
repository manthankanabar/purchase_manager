"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Create a prepared query builder for users table
const sql = neon(process.env.DATABASE_URL!);
const queryDb = drizzle(sql);

/**
 * Types for Clerk webhook data
 */
type ClerkUserData = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email_addresses?: Array<{
    email_address: string;
    id: string;
    verification?: {
      status: string;
    };
  }>;
  image_url?: string;
};

/**
 * Create a new user in our database when a user is created in Clerk
 */
export async function createUserAction(userData: ClerkUserData) {
  try {
    // Extract user details from Clerk data
    const firstName = userData.first_name || "";
    const lastName = userData.last_name || "";
    const name = `${firstName} ${lastName}`.trim() || "New User";
    
    // Find primary email
    const primaryEmail = userData.email_addresses?.find(
      (email) => email.verification?.status === "verified"
    )?.email_address;
    
    if (!primaryEmail) {
      console.error("No verified email found for user:", userData.id);
      return { success: false, error: "No verified email found" };
    }

    // Check if user already exists with this clerkId
    const existingUser = await queryDb
      .select()
      .from(users)
      .where(eq(users.clerkId, userData.id))
      .limit(1)
      .then(rows => rows[0] || null);

    if (existingUser) {
      console.log("User already exists with clerkId:", userData.id);
      return { success: true, user: existingUser };
    }

    // Create new user in our database
    const newUser = await queryDb.insert(users).values({
      clerkId: userData.id,
      name,
      email: primaryEmail,
      role: "user", // Default role
      isActive: true,
    }).returning();

    console.log("User created successfully:", newUser);
    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
}

/**
 * Update an existing user in our database when a user is updated in Clerk
 */
export async function updateUserAction(userData: ClerkUserData) {
  try {
    // Extract user details from Clerk data
    const firstName = userData.first_name || "";
    const lastName = userData.last_name || "";
    const name = `${firstName} ${lastName}`.trim();
    
    // Find primary email
    const primaryEmail = userData.email_addresses?.find(
      (email) => email.verification?.status === "verified"
    )?.email_address;
    
    if (!primaryEmail) {
      console.error("No verified email found for user:", userData.id);
      return { success: false, error: "No verified email found" };
    }

    // Check if user exists with this clerkId
    const existingUser = await queryDb
      .select()
      .from(users)
      .where(eq(users.clerkId, userData.id))
      .limit(1)
      .then(rows => rows[0] || null);

    if (!existingUser) {
      // If user doesn't exist, create them
      return createUserAction(userData);
    }

    // Update user in our database
    const updatedUser = await queryDb.update(users)
      .set({
        name: name || existingUser.name,
        email: primaryEmail,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, userData.id))
      .returning();

    console.log("User updated successfully:", updatedUser);
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error };
  }
}

/**
 * Mark a user as inactive in our database when a user is deleted in Clerk
 */
export async function deleteUserAction(userData: ClerkUserData) {
  try {
    // Check if user exists with this clerkId
    const existingUser = await queryDb
      .select()
      .from(users)
      .where(eq(users.clerkId, userData.id))
      .limit(1)
      .then(rows => rows[0] || null);

    if (!existingUser) {
      console.log("User not found with clerkId:", userData.id);
      return { success: false, error: "User not found" };
    }

    // Mark user as inactive instead of deleting
    const updatedUser = await queryDb.update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, userData.id))
      .returning();

    console.log("User marked as inactive:", updatedUser);
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error("Error marking user as inactive:", error);
    return { success: false, error };
  }
}
