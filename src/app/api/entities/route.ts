import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entities } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";

/**
 * Entity creation/update schema with validation
 */
const entitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  address: z.string().optional().nullable(),
  baseCurrency: z.enum(["INR", "USD", "EUR", "GBP"]).default("INR"),
  taxIdentificationNumber: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

/**
 * GET handler for fetching all entities
 * 
 * @param request - The incoming request
 * @returns Response with entities data or error
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch entities from database, ordered by most recently updated
    const allEntities = await db.select().from(entities).orderBy(desc(entities.updatedAt));
    
    return NextResponse.json(allEntities);
  } catch (error) {
    console.error("Error fetching entities:", error);
    return NextResponse.json(
      { error: "Failed to fetch entities" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new entity
 * 
 * @param request - The incoming request with entity data
 * @returns Response with created entity or error
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = entitySchema.parse(body);

    // Check if entity with same code already exists
    const existingEntity = await db
      .select()
      .from(entities)
      .where(eq(entities.code, validatedData.code))
      .limit(1);

    if (existingEntity.length > 0) {
      return NextResponse.json(
        { error: "An entity with this code already exists" },
        { status: 400 }
      );
    }

    // Create new entity
    const newEntity = await db.insert(entities).values({
      name: validatedData.name,
      code: validatedData.code,
      address: validatedData.address,
      baseCurrency: validatedData.baseCurrency,
      taxIdentificationNumber: validatedData.taxIdentificationNumber,
      isActive: validatedData.isActive,
    }).returning();

    return NextResponse.json(newEntity[0], { status: 201 });
  } catch (error) {
    console.error("Error creating entity:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create entity" },
      { status: 500 }
    );
  }
}
