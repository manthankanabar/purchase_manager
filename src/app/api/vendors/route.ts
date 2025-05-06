import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { vendors, entities } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

/**
 * Validation schema for creating/updating a vendor
 */
const vendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10, "Code must be at most 10 characters"),
  contactPerson: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  gstNumber: z.string().optional().nullable(),
  panNumber: z.string().optional().nullable(),
  bankDetails: z.string().optional().nullable(),
  paymentTerms: z.string().optional().nullable(),
  // Removed entityId as vendors can be used across multiple entities
  isActive: z.boolean().default(true),
});

/**
 * GET handler for fetching all vendors
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all vendors
    const allVendors = await db.select().from(vendors).orderBy(vendors.name);
    
    // Fetch entity names for vendors with entityId
    const vendorsWithEntityNames = await Promise.all(
      allVendors.map(async (vendor) => {
        if (vendor.entityId) {
          const entityResult = await db
            .select({ name: entities.name })
            .from(entities)
            .where(eq(entities.id, vendor.entityId));
          
          const entityName = entityResult.length > 0 ? entityResult[0].name : null;
          
          return {
            ...vendor,
            entityName,
          };
        }
        
        return {
          ...vendor,
          entityName: null,
        };
      })
    );
    
    return NextResponse.json(vendorsWithEntityNames);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new vendor
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
    const validatedData = vendorSchema.parse(body);

    // Check if vendor code already exists
    const existingVendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.code, validatedData.code));

    if (existingVendor.length > 0) {
      return NextResponse.json(
        { error: "Vendor code already exists" },
        { status: 400 }
      );
    }

    // Removed entityId validation as vendors are not tied to specific entities

    // Create new vendor
    const newVendor = await db.insert(vendors).values({
      name: validatedData.name,
      code: validatedData.code,
      contactPerson: validatedData.contactPerson,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address,
      gstNumber: validatedData.gstNumber,
      panNumber: validatedData.panNumber,
      bankDetails: validatedData.bankDetails,
      paymentTerms: validatedData.paymentTerms,
      // entityId is no longer included as vendors are not tied to specific entities
      isActive: validatedData.isActive,
    }).returning();

    return NextResponse.json(newVendor[0], { status: 201 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create vendor" },
      { status: 500 }
    );
  }
}
