type JWTPayload = {
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  sid: string;
  sub: string;
};

/**
 * Decode JWT token's payload section (without verification).
 */
export function decodeJwtToken(token: string): JWTPayload {
  // Get the payload part only
  const jwtPayloadSection = token.split(".")[1];
  if (jwtPayloadSection === undefined) {
    throw new Error("Invalid JWT token string format");
  }

  const base64 = jwtPayloadSection.replaceAll("-", "+").replaceAll("_", "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );

  return JSON.parse(jsonPayload);
}
