import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");

    const translations = await prisma.translation.findMany({
      where: entityType ? { entityType } : undefined,
      orderBy: { entityType: "asc" },
      take: 100,
    });
    return NextResponse.json(translations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { entityType, entityId, field, locale, value } = body;

    const translation = await prisma.translation.upsert({
      where: {
        entityType_entityId_field_locale: {
          entityType,
          entityId,
          field,
          locale,
        },
      },
      update: { value },
      create: { entityType, entityId, field, locale, value },
    });

    return NextResponse.json(translation);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    await prisma.translation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
