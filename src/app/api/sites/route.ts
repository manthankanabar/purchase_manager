import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sites, entities } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";

/**
 * Site creation/update schema with validation
 */
const siteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  address: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  entityId: z.string().uuid("Entity ID must be a valid UUID"),
  isActive: z.boolean().default(true),
});

/**
 * GET handler for fetching all sites
 * 
 * @param request - The incoming request
 * @returns Response with sites data or error
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const entityId = searchParams.get("entityId");

    // Base query
    // Build the base query
    const baseQuery = db.select({
      site: sites,
      entityName: entities.name,
    })
    .from(sites)
    .leftJoin(entities, eq(sites.entityId, entities.id))
    .orderBy(desc(sites.updatedAt));

    // Filter by entity if provided
    const query = entityId 
      ? baseQuery.where(eq(sites.entityId, entityId))
      : baseQuery;

    // Execute query
    const results = await query;

    // Transform results to a more user-friendly format
    const formattedSites = results.map(({ site, entityName }) => ({
      ...site,
      entityName,
    }));
    
    return NextResponse.json(formattedSites);
  } catch (error) {
    console.error("Error fetching sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new site
 * 
 * @param request - The incoming request with site data
 * @returns Response with created site or error
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
    const validatedData = siteSchema.parse(body);

    // Check if entity exists
    const entity = await db
      .select()
      .from(entities)
      .where(eq(entities.id, validatedData.entityId))
      .limit(1);

    if (entity.length === 0) {
      return NextResponse.json(
        { error: "Entity not found" },
        { status: 400 }
      );
    }

    // Check if site with same code already exists for this entity
    const existingSite = await db
      .select()
      .from(sites)
      .where(
        and(
          eq(sites.code, validatedData.code),
          eq(sites.entityId, validatedData.entityId)
        )
      )
      .limit(1);

    if (existingSite.length > 0) {
      return NextResponse.json(
        { error: "A site with this code already exists for this entity" },
        { status: 400 }
      );
    }

    // Create new site
    const newSite = await db.insert(sites).values({
      name: validatedData.name,
      code: validatedData.code,
      address: validatedData.address,
      contactPerson: validatedData.contactPerson,
      contactPhone: validatedData.contactPhone,
      entityId: validatedData.entityId,
      isActive: validatedData.isActive,
    }).returning();

    return NextResponse.json(newSite[0], { status: 201 });
  } catch (error) {
    console.error("Error creating site:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    );
  }
}
