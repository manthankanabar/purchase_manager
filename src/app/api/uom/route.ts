import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { uom } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET handler for fetching all units of measurement
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Fetch all active UoMs
    const allUoms = await db
      .select()
      .from(uom)
      .where(eq(uom.isActive, true))
      .orderBy(uom.name);
    
    return NextResponse.json(allUoms);
  } catch (error) {
    console.error("Error fetching UoMs:", error);
    return NextResponse.json(
      { error: "Failed to fetch UoMs" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new unit of measurement
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      );
    }
    
    // Check if UoM with same code already exists
    const existingUom = await db
      .select()
      .from(uom)
      .where(eq(uom.code, body.code))
      .limit(1);
    
    if (existingUom.length > 0) {
      return NextResponse.json(
        { error: "UoM with this code already exists" },
        { status: 400 }
      );
    }
    
    // Create new UoM
    const newUom = await db.insert(uom).values({
      name: body.name,
      code: body.code,
      description: body.description,
      isActive: body.isActive !== undefined ? body.isActive : true,
    }).returning();
    
    return NextResponse.json(newUom[0], { status: 201 });
  } catch (error) {
    console.error("Error creating UoM:", error);
    return NextResponse.json(
      { error: "Failed to create UoM" },
      { status: 500 }
    );
  }
}
