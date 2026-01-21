import type { JWTPayload } from "@/types";

/**
 * Decode JWT token's payload section (without verification).
 */
export function decodeJwtToken(token: string) {
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

  // @todo Validate on parse
  return JSON.parse(jsonPayload) as JWTPayload;
}
