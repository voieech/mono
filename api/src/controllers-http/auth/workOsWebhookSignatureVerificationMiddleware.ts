import type { Event as WorkosWebhookEvent } from "@workos-inc/node";
import type { Request, Response, NextFunction } from "express";

import { SignatureVerificationException } from "@workos-inc/node";
import { convertUnknownCatchToError } from "convert-unknown-catch-to-error";

import { workos, WORKOS_WEBHOOK_SECRET } from "../../workos/index.js";

declare global {
  namespace Express {
    interface Request {
      /**
       * Validated WorkOS webhook event object attached to request object when
       * the route has passed through the `workOsWebhookSignatureVerificationMiddleware`.
       */
      workosWebhookEvent?: WorkosWebhookEvent;
    }
  }
}

/**
 * Middleware to check if WorkOS webhook API calls have valid signatures
 */
export async function workOsWebhookSignatureVerificationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const payload = req.body;

  // Verify the webhook signature
  // WorkOS sends header as "WorkOS-Signature" but express.js lowercases it
  const sigHeader = req.headers["workos-signature"]?.toString() ?? "";

  try {
    req.workosWebhookEvent = await workos.webhooks.constructEvent({
      payload: payload,
      sigHeader: sigHeader,
      secret: WORKOS_WEBHOOK_SECRET,
    });

    next();
  } catch (e) {
    const error = convertUnknownCatchToError(e);

    if (error instanceof SignatureVerificationException) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      res.status(401).json({
        error: "Invalid WorkOS Webhook Signature",
      });
      return;
    }

    res.status(500).json({
      error: error.message,
    });
    return;
  }
}
