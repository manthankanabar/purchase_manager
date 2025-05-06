import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { stockItems, stockGroups, stockCategories, uom } from "@/db/schema";
import { stockItemSchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { suggestHsnCodeReferences, formatHsnCode } from "@/lib/hsn-codes";

// GET handler for both /api/stock-items and /api/stock-items/suggest
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Check if this is a suggest request
    const pathname = request.nextUrl.pathname;
    
    if (pathname.includes('/suggest')) {
      // Handle suggestion request
      const { searchParams } = new URL(request.url);
      const materialName = searchParams.get("materialName");
      
      if (!materialName) {
        return new NextResponse("Material name is required", { status: 400 });
      }
      
      const suggestions = suggestHsnCodeReferences(materialName);
      return NextResponse.json(suggestions);
    }
    
    // Handle regular stock items request
    try {
      // Based on the actual database structure from the migration file
      const allItems = await db
        .select({
          id: stockItems.id,
          name: stockItems.name,
          code: stockItems.code,
          description: stockItems.description,
          specifications: stockItems.specifications,
          isActive: stockItems.isActive,
          createdAt: stockItems.createdAt,
          updatedAt: stockItems.updatedAt,
          stockGroupId: stockItems.stockGroupId,
          uomId: stockItems.uomId,
          groupName: stockGroups.name,
          uomName: uom.name,
          uomCode: uom.code,
        })
        .from(stockItems)
        .leftJoin(stockGroups, eq(stockItems.stockGroupId, stockGroups.id))
        .leftJoin(uom, eq(stockItems.uomId, uom.id))
        .orderBy(stockItems.name);
      
      return NextResponse.json(allItems);
    } catch (dbError) {
      console.error("[STOCK_ITEMS_DB_ERROR]", dbError);
      
      // Fallback: Try to return just the stock items without joins
      const basicItems = await db
        .select()
        .from(stockItems)
        .orderBy(stockItems.name);
      
      return NextResponse.json(basicItems);
    }
  } catch (error) {
    console.error("[STOCK_ITEMS_GET]", error);
    return new NextResponse(`Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}

// POST /api/stock-items
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = stockItemSchema.parse(body);
    
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
    
    // Check if item with the same code already exists
    const existingItem = await db.select()
      .from(stockItems)
      .where(eq(stockItems.code, validatedData.code))
      .limit(1);
    
    if (existingItem.length > 0) {
      return new NextResponse("Stock Item with this code already exists", { status: 400 });
    }
    
    const newItem = await db.insert(stockItems).values({
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
    }).returning();
    
    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error("[STOCK_ITEMS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
