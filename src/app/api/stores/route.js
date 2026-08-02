import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { storeCreateSchema } from "@/lib/validators";
import slugify from "slugify";

// GET /api/stores — public: active stores only.
// GET /api/stores?all=1 — admin/super_admin only: every store (incl. inactive/
// unverified) with owner contact info, so the admin panel can moderate them.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));
  const search = searchParams.get("search");
  const wantsAll = searchParams.get("all") === "1";

  let isAdminView = false;
  if (wantsAll) {
    const authUser = getAuthUser(request);
    if (authUser && ["ADMIN", "SUPER_ADMIN"].includes(authUser.role)) isAdminView = true;
  }

  const where = {
    ...(isAdminView ? {} : { isActive: true }),
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
  };

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        coverUrl: true,
        address: true,
        isVerified: true,
        _count: { select: { products: true } },
        ...(isAdminView
          ? {
              isActive: true,
              createdAt: true,
              owner: { select: { fullName: true, email: true, phone: true } },
            }
          : {}),
      },
    }),
    prisma.store.count({ where }),
  ]);

  return Response.json({
    stores,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

// POST /api/stores — create a store for the current user (one per user)
export async function POST(request) {
  const authUser = getAuthUser(request);
  if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const allowedRoles = ["STORE", "FARMER", "ADMIN", "SUPER_ADMIN", "BUYER", "AGRONOMIST"];
  if (!allowedRoles.includes(authUser.role)) {
    return Response.json({ error: "Bu rol mağaza yarada bilməz" }, { status: 403 });
  }

  const existing = await prisma.store.findUnique({ where: { ownerId: authUser.sub } });
  if (existing) {
    return Response.json({ error: "Artıq mağazanız var" }, { status: 409 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Yanlış JSON formatı" }, { status: 400 });
  }

  const parsed = storeCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validasiya xətası", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const baseSlug = slugify(data.name, { lower: true, strict: true }) || `magaza-${Date.now().toString(36)}`;
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.store.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const store = await prisma.store.create({
    data: { ...data, slug, ownerId: authUser.sub },
  });

  if (authUser.role === "BUYER" || authUser.role === "AGRONOMIST") {
    await prisma.user.update({
      where: { id: authUser.sub },
      data: { role: "STORE" }
    });
  }

  return Response.json({ store }, { status: 201 });
}
