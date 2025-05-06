import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";

/**
 * Entity update schema with validation
 */
const entityUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  address: z.string().optional().nullable(),
  baseCurrency: z.enum(["INR", "USD", "EUR", "GBP"]).default("INR"),
  taxIdentificationNumber: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

/**
 * GET handler for fetching a specific entity by ID
 * 
 * @param request - The incoming request
 * @param params - Route parameters containing the entity ID
 * @returns Response with entity data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Fetch entity from database
    const entity = await db
      .select()
      .from(entities)
      .where(eq(entities.id, id))
      .limit(1);

    if (entity.length === 0) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    return NextResponse.json(entity[0]);
  } catch (error) {
    console.error("Error fetching entity:", error);
    return NextResponse.json(
      { error: "Failed to fetch entity" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating an entity
 * 
 * @param request - The incoming request with updated entity data
 * @param params - Route parameters containing the entity ID
 * @returns Response with updated entity or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Check if entity exists
    const existingEntity = await db
      .select()
      .from(entities)
      .where(eq(entities.id, id))
      .limit(1);

    if (existingEntity.length === 0) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = entityUpdateSchema.parse(body);

    // Check if code is being changed and if it conflicts with another entity
    if (validatedData.code !== existingEntity[0].code) {
      const codeConflict = await db
        .select()
        .from(entities)
        .where(eq(entities.code, validatedData.code))
        .limit(1);

      if (codeConflict.length > 0) {
        return NextResponse.json(
          { error: "An entity with this code already exists" },
          { status: 400 }
        );
      }
    }

    // Update entity
    const updatedEntity = await db
      .update(entities)
      .set({
        name: validatedData.name,
        code: validatedData.code,
        address: validatedData.address,
        baseCurrency: validatedData.baseCurrency,
        taxIdentificationNumber: validatedData.taxIdentificationNumber,
        isActive: validatedData.isActive,
        updatedAt: new Date(),
      })
      .where(eq(entities.id, id))
      .returning();

    return NextResponse.json(updatedEntity[0]);
  } catch (error) {
    console.error("Error updating entity:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update entity" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing an entity
 * 
 * @param request - The incoming request
 * @param params - Route parameters containing the entity ID
 * @returns Response with success message or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId, sessionClaims } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is an admin (only admins can delete entities)
    // Cast sessionClaims to any to access metadata.role
    // In a production environment, you should properly type this
    const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined;
    const isAdmin = metadata?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can delete entities" },
        { status: 403 }
      );
    }

    const id = params.id;

    // Check if entity exists
    const existingEntity = await db
      .select()
      .from(entities)
      .where(eq(entities.id, id))
      .limit(1);

    if (existingEntity.length === 0) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    // Instead of actually deleting, we could set isActive to false
    // This is often preferred to maintain data integrity
    const deactivatedEntity = await db
      .update(entities)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(entities.id, id))
      .returning();

    return NextResponse.json({
      message: "Entity deactivated successfully",
      entity: deactivatedEntity[0],
    });
    
    // Alternatively, if you want to actually delete the entity:
    /*
    await db.delete(entities).where(eq(entities.id, id));
    return NextResponse.json({ message: "Entity deleted successfully" });
    */
  } catch (error) {
    console.error("Error deleting entity:", error);
    return NextResponse.json(
      { error: "Failed to delete entity" },
      { status: 500 }
    );
  }
}
