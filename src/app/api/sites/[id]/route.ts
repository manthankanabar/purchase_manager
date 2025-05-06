import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sites, entities } from "@/db/schema";
import { eq, and, not } from "drizzle-orm";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";

/**
 * Site update schema with validation
 */
const siteUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  address: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  entityId: z.string().uuid("Entity ID must be a valid UUID"),
  isActive: z.boolean().default(true),
});

/**
 * GET handler for fetching a specific site by ID
 * 
 * @param request - The incoming request
 * @param params - Route parameters containing the site ID
 * @returns Response with site data or error
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

    // Fetch site with entity information
    const result = await db
      .select({
        site: sites,
        entityName: entities.name,
      })
      .from(sites)
      .leftJoin(entities, eq(sites.entityId, entities.id))
      .where(eq(sites.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Format response
    const siteData = {
      ...result[0].site,
      entityName: result[0].entityName,
    };

    return NextResponse.json(siteData);
  } catch (error) {
    console.error("Error fetching site:", error);
    return NextResponse.json(
      { error: "Failed to fetch site" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a site
 * 
 * @param request - The incoming request with updated site data
 * @param params - Route parameters containing the site ID
 * @returns Response with updated site or error
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

    // Check if site exists
    const existingSite = await db
      .select()
      .from(sites)
      .where(eq(sites.id, id))
      .limit(1);

    if (existingSite.length === 0) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = siteUpdateSchema.parse(body);

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

    // Check if code is being changed and if it conflicts with another site in the same entity
    if (validatedData.code !== existingSite[0].code || 
        validatedData.entityId !== existingSite[0].entityId) {
      const codeConflict = await db
        .select()
        .from(sites)
        .where(
          and(
            eq(sites.code, validatedData.code),
            eq(sites.entityId, validatedData.entityId),
            not(eq(sites.id, id))
          )
        )
        .limit(1);

      if (codeConflict.length > 0) {
        return NextResponse.json(
          { error: "A site with this code already exists for this entity" },
          { status: 400 }
        );
      }
    }

    // Update site
    const updatedSite = await db
      .update(sites)
      .set({
        name: validatedData.name,
        code: validatedData.code,
        address: validatedData.address,
        contactPerson: validatedData.contactPerson,
        contactPhone: validatedData.contactPhone,
        entityId: validatedData.entityId,
        isActive: validatedData.isActive,
        updatedAt: new Date(),
      })
      .where(eq(sites.id, id))
      .returning();

    return NextResponse.json(updatedSite[0]);
  } catch (error) {
    console.error("Error updating site:", error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update site" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a site
 * 
 * @param request - The incoming request
 * @param params - Route parameters containing the site ID
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
    
    // Check if user is an admin (only admins can delete sites)
    const metadata = sessionClaims?.metadata as Record<string, unknown> | undefined;
    const isAdmin = metadata?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can delete sites" },
        { status: 403 }
      );
    }

    const id = params.id;

    // Check if site exists
    const existingSite = await db
      .select()
      .from(sites)
      .where(eq(sites.id, id))
      .limit(1);

    if (existingSite.length === 0) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Instead of actually deleting, we set isActive to false
    // This is preferred to maintain data integrity
    const deactivatedSite = await db
      .update(sites)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(sites.id, id))
      .returning();

    return NextResponse.json({
      message: "Site deactivated successfully",
      site: deactivatedSite[0],
    });
  } catch (error) {
    console.error("Error deactivating site:", error);
    return NextResponse.json(
      { error: "Failed to deactivate site" },
      { status: 500 }
    );
  }
}
