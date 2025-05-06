import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { stockCategories } from "@/db/schema";
import { stockCategorySchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { getUniqueHsnPrefixCodes } from "@/lib/hsn-codes";

// GET /api/stock-categories
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Check if this is a hsn-prefixes request
    const pathname = request.nextUrl.pathname;
    
    if (pathname.includes('/hsn-prefixes')) {
      const hsnPrefixCodes = getUniqueHsnPrefixCodes();
      return NextResponse.json(hsnPrefixCodes);
    }
    
    const allCategories = await db.select().from(stockCategories).orderBy(stockCategories.name);
    
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("[STOCK_CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/stock-categories
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = stockCategorySchema.parse(body);
    
    // Check if category with the same prefix code already exists
    const existingCategory = await db.select()
      .from(stockCategories)
      .where(eq(stockCategories.prefixCode, validatedData.prefixCode))
      .limit(1);
    
    if (existingCategory.length > 0) {
      return new NextResponse("Category with this prefix code already exists", { status: 400 });
    }
    
    const newCategory = await db.insert(stockCategories).values({
      name: validatedData.name,
      prefixCode: validatedData.prefixCode,
      description: validatedData.description,
      isActive: validatedData.isActive,
    }).returning();
    
    return NextResponse.json(newCategory[0]);
  } catch (error) {
    console.error("[STOCK_CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


