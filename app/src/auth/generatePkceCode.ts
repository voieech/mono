import * as Crypto from "expo-crypto";

import { base64URLEncode } from "@/utils";

/**
 * Custom PKCE code generation implementation
 */
export async function generatePkceCode() {
  /**
   * 128 char PKCE code verifier generated using UUIDs
   */
  const codeVerifier = (
    Crypto.randomUUID() +
    Crypto.randomUUID() +
    Crypto.randomUUID() +
    Crypto.randomUUID()
  ).replaceAll("-", "");

  /**
   * PKCE code challenge created from PKCE code verifier using SHA256
   */
  const codeChallenge = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  ).then(base64URLEncode);

  /**
   * Const to Sha256 for now since this is the only supported option
   */
  const codeChallengeMethod = "S256" as const;

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod,
  };
}
