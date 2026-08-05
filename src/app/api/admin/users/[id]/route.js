import { prisma } from "@/lib/prisma";
import { getAuthUser, requireRole } from "@/lib/auth";
import { adminUserUpdateSchema } from "@/lib/validators";

export async function PATCH(request, { params }) {
  const authUser = getAuthUser(request);
  const denied = requireRole(authUser, ["ADMIN", "SUPER_ADMIN"]);
  if (denied) return denied;

  const { id } = await params;

  // Only SUPER_ADMIN can promote/demote to ADMIN or SUPER_ADMIN
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Yanlış JSON formatı" }, { status: 400 });
  }

  const parsed = adminUserUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validasiya xətası", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  if (
    parsed.data.role &&
    ["ADMIN", "SUPER_ADMIN"].includes(parsed.data.role) &&
    authUser.role !== "SUPER_ADMIN"
  ) {
    return Response.json(
      { error: "Yalnız Super Admin bu rolu təyin edə bilər" },
      { status: 403 }
    );
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return Response.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

  const updated = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: { id: true, email: true, role: true, status: true, isBanned: true, fullName: true, phone: true, username: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: authUser.sub,
      action: "ADMIN_USER_UPDATED",
      entity: "User",
      entityId: id,
      metadata: parsed.data,
    },
  });

  return Response.json({ user: updated });
}


// DELETE /api/admin/users/[id] — delete a user profile (ADMIN/SUPER_ADMIN only)
export async function DELETE(request, { params }) {
  const authUser = getAuthUser(request);
  if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const denied = requireRole(authUser, ["ADMIN", "SUPER_ADMIN"]);
  if (denied) return denied;

  const { id } = await params;

  // Prevent self-deletion
  if (id === authUser.sub) {
    return Response.json({ error: "Öz profilinizi silə bilməzsiniz" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return Response.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

  // Prevent deleting another SUPER_ADMIN unless you are SUPER_ADMIN
  if (target.role === "SUPER_ADMIN" && authUser.role !== "SUPER_ADMIN") {
    return Response.json({ error: "Yalnız Super Admin digər Super Admin-i silə bilər" }, { status: 403 });
  }

  // Cascade: delete user's products, stores, orders, reviews, messages first
  await prisma.review.deleteMany({ where: { authorId: id } });
  await prisma.conversation.deleteMany({ where: { OR: [{ user1Id: id }, { user2Id: id }] } });
  await prisma.product.deleteMany({ where: { sellerId: id } });
  await prisma.store.deleteMany({ where: { ownerId: id } });
  await prisma.order.deleteMany({ where: { buyerId: id } });
  await prisma.wallet.deleteMany({ where: { userId: id } });
  await prisma.auditLog.deleteMany({ where: { OR: [{ userId: id }, { entityId: id }] } });
  await prisma.favorite.deleteMany({ where: { userId: id } });

  await prisma.user.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: authUser.sub,
      action: "ADMIN_USER_DELETED",
      entity: "User",
      entityId: id,
      metadata: { deletedEmail: target.email, deletedName: target.fullName },
    },
  });

  return Response.json({ success: true });
}
