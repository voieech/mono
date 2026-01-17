import * as Crypto from "expo-crypto";

export const generatePKCE = async () => {
  // Generate random code verifier (43-128 characters)
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const codeVerifier = base64URLEncode(randomBytes);

  // Create code challenge from verifier using SHA256
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );
  const codeChallenge = base64URLEncode(digest);

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: "S256",
  };
};

// Helper to convert base64 to base64url format (RFC 4648)
const base64URLEncode = (str: string | Uint8Array): string => {
  let base64: string;

  if (typeof str === "string") {
    base64 = str;
  } else {
    // Convert Uint8Array to base64
    base64 = btoa(String.fromCharCode(...str));
  }

  // Convert to base64url format
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};
