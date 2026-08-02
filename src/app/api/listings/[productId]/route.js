import { prisma } from "@/lib/prisma";

// POST /api/listings/:productId/click — increments click counter (CTR analytics)
export async function POST(request, { params }) {
  const { productId } = params;

  const listing = await prisma.listing.findUnique({ where: { productId } });
  if (!listing) return Response.json({ error: "Listing tapılmadı" }, { status: 404 });

  await prisma.listing.update({
    where: { productId },
    data: { clicks: { increment: 1 } },
  });

  return Response.json({ success: true });
}

// DELETE /api/listings/:productId — downgrade back to STANDARD
export async function DELETE(request, { params }) {
  const { productId } = params;
  const existing = await prisma.listing.findUnique({ where: { productId } });
  if (!existing) return Response.json({ error: "Listing tapılmadı" }, { status: 404 });

  await prisma.listing.update({
    where: { productId },
    data: { tier: "STANDARD", endDate: null, autoRenew: false },
  });

  return Response.json({ success: true });
}
