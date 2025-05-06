import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { stockGroups, stockCategories } from "@/db/schema";
import { stockGroupSchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { getHsnCodeNamesForPrefix } from "@/lib/hsn-codes";

// GET /api/stock-groups
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Check if this is a code-names request
    const pathname = request.nextUrl.pathname;
    
    if (pathname.includes('/code-names')) {
      const { searchParams } = new URL(request.url);
      const prefixCode = searchParams.get("prefixCode");
      
      if (!prefixCode) {
        return new NextResponse("Prefix code is required", { status: 400 });
      }
      
      const codeNames = getHsnCodeNamesForPrefix(prefixCode);
      return NextResponse.json(codeNames);
    }
    
    // Join with stock categories to get category information
    const allGroups = await db
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
      .orderBy(stockGroups.name);
    
    return NextResponse.json(allGroups);
  } catch (error) {
    console.error("[STOCK_GROUPS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/stock-groups
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = stockGroupSchema.parse(body);
    
    // Check if category exists
    const category = await db.select()
      .from(stockCategories)
      .where(eq(stockCategories.id, validatedData.categoryId))
      .limit(1);
    
    if (category.length === 0) {
      return new NextResponse("Category not found", { status: 400 });
    }
    
    // Check if group with the same code already exists
    const existingGroup = await db.select()
      .from(stockGroups)
      .where(eq(stockGroups.code, validatedData.code))
      .limit(1);
    
    if (existingGroup.length > 0) {
      return new NextResponse("Group with this code already exists", { status: 400 });
    }
    
    const newGroup = await db.insert(stockGroups).values({
      name: validatedData.name,
      code: validatedData.code,
      categoryId: validatedData.categoryId,
      description: validatedData.description,
      defaultGstRate: validatedData.defaultGstRate,
      isActive: validatedData.isActive,
    }).returning();
    
    return NextResponse.json(newGroup[0]);
  } catch (error) {
    console.error("[STOCK_GROUPS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

