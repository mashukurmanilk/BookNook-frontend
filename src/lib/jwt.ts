import { SignJWT, jwtVerify } from "jose";

const getSecretKey = () => {
  return new TextEncoder().encode(
    process.env.BETTER_AUTH_SECRET || "booknook_super_secure_jwt_auth_secret_2026_key"
  );
};

export async function signUserToken(user: {
  id: string;
  email: string;
  name?: string | null;
}) {
  const secret = getSecretKey();
  const token = await new SignJWT({
    id: user.id,
    sub: user.id,
    email: user.email,
    name: user.name || user.email.split("@")[0],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return token;
}

export async function verifyUserToken(token: string) {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}
