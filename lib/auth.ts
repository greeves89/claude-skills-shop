import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-change-me-aaaaaaaaaaaaaaaa"
);

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ sub: email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  (await cookies()).set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const c = (await cookies()).get("admin_session");
  if (!c) return null;
  try {
    const { payload } = await jwtVerify(c.value, secret);
    return { email: String(payload.sub) };
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  (await cookies()).delete("admin_session");
}
