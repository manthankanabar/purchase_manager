import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { stockItems, stockGroups, stockCategories, uom } from "@/db/schema/index";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = getAuth(request);
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Test database connection and tables
    const dbStatus = {
      connection: "OK",
      tables: {
        stockItems: await db.select({ count: { id: stockItems.id } }).from(stockItems),
        stockGroups: await db.select({ count: { id: stockGroups.id } }).from(stockGroups),
        stockCategories: await db.select({ count: { id: stockCategories.id } }).from(stockCategories),
        uom: await db.select({ count: { id: uom.id } }).from(uom)
      }
    };
    
    return NextResponse.json(dbStatus);
  } catch (error) {
    console.error("[DB_TEST]", error);
    return new NextResponse(`Database error: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }
}
