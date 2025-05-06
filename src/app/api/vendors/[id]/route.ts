import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { vendors, entities } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

/**
 * Validation schema for updating a vendor
 */
const vendorUpdateSchema = z.object({
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
});

/**
 * GET handler for fetching a specific vendor by ID
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

    const vendorId = params.id;

    // Fetch vendor by ID
    const vendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, vendorId));

    if (vendor.length === 0) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // If vendor has an entityId, fetch the entity name
    let entityName = null;
    if (vendor[0].entityId) {
      const entityResult = await db
        .select({ name: entities.name })
        .from(entities)
        .where(eq(entities.id, vendor[0].entityId));
      
      entityName = entityResult.length > 0 ? entityResult[0].name : null;
    }

    return NextResponse.json({
      ...vendor[0],
      entityName,
    });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a vendor
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

    const vendorId = params.id;

    // Check if vendor exists
    const existingVendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, vendorId));

    if (existingVendor.length === 0) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = vendorUpdateSchema.parse(body);

    // Check if the updated code already exists for another vendor
    if (validatedData.code !== existingVendor[0].code) {
      const vendorWithSameCode = await db
        .select()
        .from(vendors)
        .where(and(
          eq(vendors.code, validatedData.code),
          eq(vendors.isActive, true)
        ));

      if (vendorWithSameCode.length > 0) {
        return NextResponse.json(
          { error: "Vendor code already exists" },
          { status: 400 }
        );
      }
    }

    // Removed entityId validation as vendors are not tied to specific entities

    // Update vendor
    const updatedVendor = await db
      .update(vendors)
      .set({
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
        // Removed entityId as vendors are not tied to specific entities
        updatedAt: new Date(),
      })
      .where(eq(vendors.id, vendorId))
      .returning();

    return NextResponse.json(updatedVendor[0]);
  } catch (error) {
    console.error("Error updating vendor:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update vendor" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for deactivating a vendor (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vendorId = params.id;

    // Check if vendor exists
    const existingVendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.id, vendorId));

    if (existingVendor.length === 0) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Soft delete (deactivate) the vendor
    const deactivatedVendor = await db
      .update(vendors)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(vendors.id, vendorId))
      .returning();

    return NextResponse.json(deactivatedVendor[0]);
  } catch (error) {
    console.error("Error deactivating vendor:", error);
    return NextResponse.json(
      { error: "Failed to deactivate vendor" },
      { status: 500 }
    );
  }
}
