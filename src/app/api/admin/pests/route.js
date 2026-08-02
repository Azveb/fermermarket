import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

export async function GET() {
  try {
    const pests = await prisma.pest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(pests);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, name, nameAz, symptoms, lifecycle, prevention } = body;

    const baseSlug = slugify(nameAz || name, { lower: true, strict: true });
    
    if (id) {
      const updated = await prisma.pest.update({
        where: { id },
        data: { name, nameAz, symptoms, lifecycle, prevention }
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.pest.create({
        data: { name, nameAz, slug: `${baseSlug}-${Date.now().toString(36)}`, symptoms, lifecycle, prevention }
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

    await prisma.pest.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
