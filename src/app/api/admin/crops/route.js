import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

export async function GET() {
  try {
    const crops = await prisma.crop.findMany({
      orderBy: { nameAz: 'asc' }
    });
    return NextResponse.json(crops);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, name, nameAz, image } = body;

    const baseSlug = slugify(nameAz || name, { lower: true, strict: true });
    
    if (id) {
      const updated = await prisma.crop.update({
        where: { id },
        data: { name, nameAz, image }
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.crop.create({
        data: { name, nameAz, slug: `${baseSlug}-${Date.now().toString(36)}`, image }
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.crop.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
