import { prisma } from "@/lib/prisma";
import { getAuthUser, requireRole } from "@/lib/auth";
import { adminUserUpdateSchema } from "@/lib/validators";

export async function PATCH(request, { params }) {
  const authUser = getAuthUser(request);
  const denied = requireRole(authUser, ["ADMIN", "SUPER_ADMIN"]);
  if (denied) return denied;

  const { id } = params;

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
    select: { id: true, email: true, role: true, status: true, isBanned: true },
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
