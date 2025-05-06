import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { vendors } from "@/db/schema";

/**
 * GET handler for fetching all vendor codes
 * Used for auto-generating unique vendor codes
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all vendor codes
    const vendorCodes = await db
      .select({ code: vendors.code })
      .from(vendors);
    
    // Extract just the code strings
    const codes = vendorCodes.map(vendor => vendor.code);
    
    return NextResponse.json(codes);
  } catch (error) {
    console.error("Error fetching vendor codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor codes" },
      { status: 500 }
    );
  }
}
