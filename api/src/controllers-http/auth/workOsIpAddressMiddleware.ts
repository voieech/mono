import type { Request, Response, NextFunction } from "express";

import { ForbiddenException } from "../../exceptions/index.js";

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

const unauthorizedErrorMessage =
  "Unauthorized WorkOS webhook API access attempt from non whitelisted IP address";

/**
 * Middleware to check if WorkOS webhook API calls are being sent from valid
 * WorkOS IP addresses.
 *
 * Assumes that we are running on Digital Ocean's App Platform
 */
export async function workOsIpAddressMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  if (Array.isArray(req.originalIpAddress)) {
    for (const ipAddress of req.originalIpAddress) {
      if (WORKOS_IP_ADDRESSESS.has(ipAddress)) {
        next();
        return;
      }
    }
    throw new ForbiddenException(unauthorizedErrorMessage);
  }

  if (!WORKOS_IP_ADDRESSESS.has(req.originalIpAddress)) {
    throw new ForbiddenException(unauthorizedErrorMessage);
  }
  next();
}
