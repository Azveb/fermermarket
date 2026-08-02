import { prisma } from "@/lib/prisma";
import { hashResetToken, hashPassword } from "@/lib/auth";
import { passwordResetConfirmSchema } from "@/lib/validators";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Yanlış JSON formatı" }, { status: 400 });
  }

  const parsed = passwordResetConfirmSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validasiya xətası", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { token, newPassword } = parsed.data;
  const tokenHash = hashResetToken(token);

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
    return Response.json({ error: "Bərpa linki etibarsız və ya müddəti bitib" }, { status: 400 });
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true },
    }),
    // Invalidate all existing refresh tokens on password change
    prisma.refreshToken.updateMany({
      where: { userId: resetRecord.userId },
      data: { revoked: true },
    }),
  ]);

  return Response.json({ message: "Şifrə uğurla yeniləndi. Yenidən daxil olun." });
}
