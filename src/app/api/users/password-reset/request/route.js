import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/auth";
import { passwordResetRequestSchema } from "@/lib/validators";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";

const RESET_TOKEN_TTL_MINUTES = 30;

export async function POST(request) {
  // Apply rate limiting: 3 attempts / hour
  const rl = rateLimit(request, { limit: 3, windowMs: 60 * 60_000, keyPrefix: "pwd_reset" });
  if (rl) return rl;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Yanlış JSON formatı" }, { status: 400 });
  }

  const parsed = passwordResetRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Düzgün e-poçt daxil edin" }, { status: 422 });
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return 200 regardless of whether the user exists —
  // prevents account enumeration via this endpoint.
  if (!user) {
    return Response.json({ message: "Əgər bu e-poçt qeydiyyatdadırsa, bərpa linki göndərildi." });
  }

  const { rawToken, tokenHash } = generatePasswordResetToken();
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

  // Invalidate previous tokens for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fermermarket.vercel.app";
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail({ to: user.email, resetUrl });

  return Response.json({ message: "Əgər bu e-poçt qeydiyyatdadırsa, bərpa linki göndərildi." });
}
