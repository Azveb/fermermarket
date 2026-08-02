import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

function isAdmin(u) { return u && ["SUPER_ADMIN","ADMIN"].includes(u.role); }

export async function PATCH(request, { params }) {
  const authUser = getAuthUser(request);
  if (!isAdmin(authUser)) return Response.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const slide = await prisma.homepageSlide.update({ where: { id: params.id }, data: body });
  return Response.json({ slide });
}

export async function DELETE(request, { params }) {
  const authUser = getAuthUser(request);
  if (!isAdmin(authUser)) return Response.json({ error: "Forbidden" }, { status: 403 });
  await prisma.homepageSlide.delete({ where: { id: params.id } });
  return Response.json({ ok: true });
}
