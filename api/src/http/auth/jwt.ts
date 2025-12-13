import jwt from "jsonwebtoken";

if (process.env["JWT_SECRET"] === undefined) {
  throw new Error("process.env.JWT_SECRET is undefined");
}

export const JWT_SECRET = process.env["JWT_SECRET"];
const JWT_EXPIRES_IN = "15m";

export function signMobileJwt(user: { id: string; email: string }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}
