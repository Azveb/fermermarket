import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// PATCH /api/notifications/:id — mark single as read
export async function PATCH(request, { params }) {
  const authUser = getAuthUser(request);
  if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const notif = await prisma.notification.findUnique({ where: { id: params.id } });
  if (!notif || notif.userId !== authUser.sub) {
    return Response.json({ error: "Tapılmadı" }, { status: 404 });
  }

  await prisma.notification.update({ where: { id: params.id }, data: { isRead: true } });
  return Response.json({ success: true });
}

// DELETE /api/notifications/:id
export async function DELETE(request, { params }) {
  const authUser = getAuthUser(request);
  if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const notif = await prisma.notification.findUnique({ where: { id: params.id } });
  if (!notif || notif.userId !== authUser.sub) {
    return Response.json({ error: "Tapılmadı" }, { status: 404 });
  }

  await prisma.notification.delete({ where: { id: params.id } });
  return Response.json({ success: true });
}
