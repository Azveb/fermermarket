import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all blocks for a page
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "home";
    
    const blocks = await prisma.dynamicBlock.findMany({
      where: { page, isActive: true },
      orderBy: { sortOrder: "asc" }
    });
    
    return NextResponse.json(blocks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST to update all blocks (save layout)
export async function POST(req) {
  try {
    const { blocks, page = "home" } = await req.json();
    
    // Simple approach: Delete existing and recreate
    // In production, we'd do a transaction to update existing ones.
    await prisma.$transaction(async (tx) => {
      await tx.dynamicBlock.deleteMany({ where: { page } });
      
      const toCreate = blocks.map((b, i) => ({
        page,
        type: b.type,
        props: b.props,
        sortOrder: i,
        isActive: b.isActive ?? true
      }));
      
      if (toCreate.length > 0) {
        await tx.dynamicBlock.createMany({ data: toCreate });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
