import { redactionPlugin as RedactionPlugin } from "@loglayer/plugin-redaction";

/**
 * Get an array of paths to redact from logs
 */
function getRedactionPaths() {
  // Special env var to disable redaction
  if (process.env["LOG_DISABLE_REDACTION"] === "true") {
    return [];
  }

  // PII data to redact with case-sensitive + nested paths
  return [
    // Matches specific item paths
    "req.headers.authorization",
    "req.body",

    // Do up to 4 levels deep of matching, e.g. "meta.req.body.user.email"
    "*.email",
    "*.*.email",
    "*.*.*.email",
    "*.*.*.*.email",
    "*.key",
    "*.*.key",
    "*.*.*.key",
    "*.*.*.*.key",
    "*.token",
    "*.*.token",
    "*.*.*.token",
    "*.*.*.*.token",
    "*.secret",
    "*.*.secret",
    "*.*.*.secret",
    "*.*.*.*.secret",
    "*.password",
    "*.*.password",
    "*.*.*.password",
    "*.*.*.*.password",
    "*.address",
    "*.*.address",
    "*.*.*.address",
    "*.*.*.*.address",
  ];
}

export const redactionPlugin = RedactionPlugin({
  paths: getRedactionPaths(),
});
