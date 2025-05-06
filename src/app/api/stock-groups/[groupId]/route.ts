import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { stockGroups, stockCategories } from "@/db/schema";
import { stockGroupSchema } from "@/lib/types";
import { eq } from "drizzle-orm";

// GET /api/stock-groups/[groupId]
export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.groupId) {
      return new NextResponse("Group ID is required", { status: 400 });
    }
    
    const group = await db
      .select({
        id: stockGroups.id,
        name: stockGroups.name,
        code: stockGroups.code,
        description: stockGroups.description,
        defaultGstRate: stockGroups.defaultGstRate,
        isActive: stockGroups.isActive,
        createdAt: stockGroups.createdAt,
        updatedAt: stockGroups.updatedAt,
        categoryId: stockGroups.categoryId,
        categoryName: stockCategories.name,
        categoryPrefixCode: stockCategories.prefixCode,
      })
      .from(stockGroups)
      .leftJoin(stockCategories, eq(stockGroups.categoryId, stockCategories.id))
      .where(eq(stockGroups.id, params.groupId))
      .limit(1);
    
    if (group.length === 0) {
      return new NextResponse("Group not found", { status: 404 });
    }
    
    return NextResponse.json(group[0]);
  } catch (error) {
    console.error("[STOCK_GROUP_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT /api/stock-groups/[groupId]
export async function PUT(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.groupId) {
      return new NextResponse("Group ID is required", { status: 400 });
    }
    
    const body = await request.json();
    const validatedData = stockGroupSchema.parse(body);
    
    // Check if group exists
    const existingGroup = await db.select()
      .from(stockGroups)
      .where(eq(stockGroups.id, params.groupId))
      .limit(1);
    
    if (existingGroup.length === 0) {
      return new NextResponse("Group not found", { status: 404 });
    }
    
    // Check if category exists
    const category = await db.select()
      .from(stockCategories)
      .where(eq(stockCategories.id, validatedData.categoryId))
      .limit(1);
    
    if (category.length === 0) {
      return new NextResponse("Category not found", { status: 400 });
    }
    
    // Check if code is already used by another group
    if (validatedData.code !== existingGroup[0].code) {
      const duplicateCode = await db.select()
        .from(stockGroups)
        .where(eq(stockGroups.code, validatedData.code))
        .limit(1);
      
      if (duplicateCode.length > 0) {
        return new NextResponse("Group with this code already exists", { status: 400 });
      }
    }
    
    const updatedGroup = await db.update(stockGroups)
      .set({
        name: validatedData.name,
        code: validatedData.code,
        categoryId: validatedData.categoryId,
        description: validatedData.description,
        defaultGstRate: validatedData.defaultGstRate,
        isActive: validatedData.isActive,
        updatedAt: new Date(),
      })
      .where(eq(stockGroups.id, params.groupId))
      .returning();
    
    return NextResponse.json(updatedGroup[0]);
  } catch (error) {
    console.error("[STOCK_GROUP_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/stock-groups/[groupId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.groupId) {
      return new NextResponse("Group ID is required", { status: 400 });
    }
    
    // Check if group exists
    const existingGroup = await db.select()
      .from(stockGroups)
      .where(eq(stockGroups.id, params.groupId))
      .limit(1);
    
    if (existingGroup.length === 0) {
      return new NextResponse("Group not found", { status: 404 });
    }
    
    // TODO: Check if group is used by any stock items before deleting
    
    await db.delete(stockGroups)
      .where(eq(stockGroups.id, params.groupId));
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STOCK_GROUP_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
