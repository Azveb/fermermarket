import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// GET /api/brands/[id] — public brand detail with products
export async function GET(request, { params }) {
  const brand = await prisma.brand.findUnique({
    where: { id: params.id },
    include: {
      products: {
        where: { status: "ACTIVE" },
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!brand) return Response.json({ error: "Brend tapılmadı" }, { status: 404 });
  return Response.json({ brand });
}

// PATCH /api/brands/[id] — admin only
export async function PATCH(request, { params }) {
  const user = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if (user.error) return Response.json({ error: user.error }, { status: user.status || 403 });

  try {
    const body = await request.json();
    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: body,
    });
    return Response.json({ brand });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/brands/[id]
export async function DELETE(request, { params }) {
  const user = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if (user.error) return Response.json({ error: user.error }, { status: user.status || 403 });

  try {
    await prisma.brand.delete({ where: { id: params.id } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
