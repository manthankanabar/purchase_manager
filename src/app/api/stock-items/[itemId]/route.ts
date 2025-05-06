import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { stockItems, stockGroups, stockCategories, uom } from "@/db/schema";
import { stockItemSchema } from "@/lib/types";
import { eq } from "drizzle-orm";

// GET /api/stock-items/[itemId]
export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.itemId) {
      return new NextResponse("Item ID is required", { status: 400 });
    }
    
    const item = await db
      .select({
        id: stockItems.id,
        name: stockItems.name,
        code: stockItems.code,
        description: stockItems.description,
        specifications: stockItems.specifications,
        cgstRate: stockItems.cgstRate,
        sgstRate: stockItems.sgstRate,
        igstRate: stockItems.igstRate,
        hsnCode: stockItems.hsnCode,
        isActive: stockItems.isActive,
        createdAt: stockItems.createdAt,
        updatedAt: stockItems.updatedAt,
        stockCategoryId: stockItems.stockCategoryId,
        stockGroupId: stockItems.stockGroupId,
        uomId: stockItems.uomId,
        categoryName: stockCategories.name,
        categoryPrefixCode: stockCategories.prefixCode,
        groupName: stockGroups.name,
        uomName: uom.name,
        uomCode: uom.code,
      })
      .from(stockItems)
      .leftJoin(stockCategories, eq(stockItems.stockCategoryId, stockCategories.id))
      .leftJoin(stockGroups, eq(stockItems.stockGroupId, stockGroups.id))
      .leftJoin(uom, eq(stockItems.uomId, uom.id))
      .where(eq(stockItems.id, params.itemId))
      .limit(1);
    
    if (item.length === 0) {
      return new NextResponse("Item not found", { status: 404 });
    }
    
    return NextResponse.json(item[0]);
  } catch (error) {
    console.error("[STOCK_ITEM_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT /api/stock-items/[itemId]
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.itemId) {
      return new NextResponse("Item ID is required", { status: 400 });
    }
    
    const body = await request.json();
    const validatedData = stockItemSchema.parse(body);
    
    // Check if item exists
    const existingItem = await db.select()
      .from(stockItems)
      .where(eq(stockItems.id, params.itemId))
      .limit(1);
    
    if (existingItem.length === 0) {
      return new NextResponse("Item not found", { status: 404 });
    }
    
    // Check if UoM exists
    const uomExists = await db.select()
      .from(uom)
      .where(eq(uom.id, validatedData.uomId))
      .limit(1);
    
    if (uomExists.length === 0) {
      return new NextResponse("Unit of Measurement not found", { status: 400 });
    }
    
    // Check if category exists if provided
    if (validatedData.stockCategoryId) {
      const categoryExists = await db.select()
        .from(stockCategories)
        .where(eq(stockCategories.id, validatedData.stockCategoryId))
        .limit(1);
      
      if (categoryExists.length === 0) {
        return new NextResponse("Stock Category not found", { status: 400 });
      }
    }
    
    // Check if group exists if provided
    if (validatedData.stockGroupId) {
      const groupExists = await db.select()
        .from(stockGroups)
        .where(eq(stockGroups.id, validatedData.stockGroupId))
        .limit(1);
      
      if (groupExists.length === 0) {
        return new NextResponse("Stock Group not found", { status: 400 });
      }
    }
    
    // Check if code is already used by another item
    if (validatedData.code !== existingItem[0].code) {
      const duplicateCode = await db.select()
        .from(stockItems)
        .where(eq(stockItems.code, validatedData.code))
        .limit(1);
      
      if (duplicateCode.length > 0) {
        return new NextResponse("Stock Item with this code already exists", { status: 400 });
      }
    }
    
    const updatedItem = await db.update(stockItems)
      .set({
        name: validatedData.name,
        code: validatedData.code,
        description: validatedData.description,
        stockCategoryId: validatedData.stockCategoryId,
        stockGroupId: validatedData.stockGroupId,
        uomId: validatedData.uomId,
        specifications: validatedData.specifications,
        cgstRate: validatedData.cgstRate,
        sgstRate: validatedData.sgstRate,
        igstRate: validatedData.igstRate,
        hsnCode: validatedData.hsnCode,
        isActive: validatedData.isActive,
        updatedAt: new Date(),
      })
      .where(eq(stockItems.id, params.itemId))
      .returning();
    
    return NextResponse.json(updatedItem[0]);
  } catch (error) {
    console.error("[STOCK_ITEM_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/stock-items/[itemId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!params.itemId) {
      return new NextResponse("Item ID is required", { status: 400 });
    }
    
    // Check if item exists
    const existingItem = await db.select()
      .from(stockItems)
      .where(eq(stockItems.id, params.itemId))
      .limit(1);
    
    if (existingItem.length === 0) {
      return new NextResponse("Item not found", { status: 404 });
    }
    
    // TODO: Check if item is used by any purchase orders or inventory before deleting
    
    await db.delete(stockItems)
      .where(eq(stockItems.id, params.itemId));
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STOCK_ITEM_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
