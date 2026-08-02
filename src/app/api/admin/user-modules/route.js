import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/admin/user-modules?userId=xxx — istifadəçinin modullarını al
export async function GET(request) {
  const authUser = getAuthUser(request);
  if (!authUser || authUser.role !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "userId tələb olunur" }, { status: 400 });
  }

  const modules = await prisma.userModule.findMany({
    where: { userId },
    select: { id: true, module: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ modules });
}

// POST /api/admin/user-modules — modul əlavə et
export async function POST(request) {
  const authUser = getAuthUser(request);
  if (!authUser || authUser.role !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { userId, module } = body;
  if (!userId || !module) {
    return Response.json({ error: "userId və module tələb olunur" }, { status: 400 });
  }

  const VALID_MODULES = ["WALLET","BLOG","BUNDLES","CORPORATE_LISTINGS","AI_AGRONOM","ANALYTICS","CAMPAIGNS","BULK_CSV","DELIVERY","LEADERBOARD"];
  if (!VALID_MODULES.includes(module)) {
    return Response.json({ error: "Yanlış modul adı" }, { status: 400 });
  }

  // İstifadəçi mövcuddurmu?
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, fullName: true } });
  if (!user) return Response.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

  const created = await prisma.userModule.upsert({
    where: { userId_module: { userId, module } },
    create: { userId, module, grantedBy: authUser.sub },
    update: { grantedBy: authUser.sub },
  });

  return Response.json({ success: true, userModule: created });
}

// DELETE /api/admin/user-modules — modul sil
export async function DELETE(request) {
  const authUser = getAuthUser(request);
  if (!authUser || authUser.role !== "SUPER_ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const { userId, module } = body;
  if (!userId || !module) {
    return Response.json({ error: "userId və module tələb olunur" }, { status: 400 });
  }

  await prisma.userModule.deleteMany({ where: { userId, module } });
  return Response.json({ success: true });
}
