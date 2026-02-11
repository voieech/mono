import type { Request, Response, NextFunction } from "express";

// List of WorkOS fixed IP addresses provided in their documentation
const WORKOS_IP_ADDRESSESS: ReadonlySet<string> = new Set([
  "3.217.146.166",
  "23.21.184.92",
  "34.204.154.149",
  "44.213.245.178",
  "44.215.236.82",
  "50.16.203.9",
  "52.1.251.34",
  "52.21.49.187",
  "174.129.36.47",
]);

/**
 * Middleware to check if WorkOS webhook API calls are being sent from valid
 * WorkOS IP addresses.
 *
 * Assumes that we are running on Digital Ocean's App Platform
 */
export async function workOsIpAddressMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Use DigitalOcean's specific header for the true client IP
  const originalIpAddress = req.headers["do-connecting-ip"] ?? "";

  if (Array.isArray(originalIpAddress)) {
    for (const ipAddress of originalIpAddress) {
      if (WORKOS_IP_ADDRESSESS.has(ipAddress)) {
        next();
        return;
      }
    }
    res.status(403).json({
      error: "Forbidden: Unauthorized IP address",
    });
    return;
  }

  if (WORKOS_IP_ADDRESSESS.has(originalIpAddress)) {
    next();
    return;
  }

  // eslint-disable-next-line no-console
  console.error(
    `${workOsIpAddressMiddleware.name}: Unauthorized access attempt from IP: ${originalIpAddress}`,
  );
  res.status(403).json({
    error: "Forbidden: Unauthorized IP address",
  });
  return;
}
