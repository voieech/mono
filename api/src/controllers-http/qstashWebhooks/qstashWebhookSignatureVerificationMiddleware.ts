import type { Request, Response, NextFunction } from "express";

import { SignatureError } from "@upstash/qstash";
import { convertUnknownCatchToError } from "convert-unknown-catch-to-error";

import type { QstashEvent } from "./qstashEventSchema.js";

import {
  InvalidInternalStateException,
  InvalidInputException,
  UnauthorizedException,
  ValidationFailedException,
} from "../../exceptions/index.js";
import { qstashReceiver } from "../../qstash/index.js";
import { qstashEventSchema } from "./qstashEventSchema.js";

declare global {
  namespace Express {
    interface Request {
      /**
       * Validated Qstash webhook event object attached to request object when
       * the route has passed through the `qstashWebhookSignatureVerificationMiddleware`.
       */
      qstashEvent?: QstashEvent;
    }
  }
}

/**
 * Middleware to check if qstash webhook API calls have valid signatures and
 * body shape.
 */
export async function qstashWebhookSignatureVerificationMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const rawRequestBody = req.rawBody;
  if (rawRequestBody === undefined) {
    throw new InvalidInternalStateException(
      `Missing req.rawBody for qstash webhook signature verification middleware`,
    );
  }

  // qstash sends header as "Upstash-Message-Id" but express.js lowercases it
  const qstashMessageID = req.headers["upstash-message-id"]?.toString();
  if (qstashMessageID === undefined) {
    throw new InvalidInputException(
      `Missing unique qstash message ID in header`,
    );
  }

  // qstash sends header as "Upstash-Signature" but express.js lowercases it
  const signature = req.headers["upstash-signature"]?.toString() ?? "";

  try {
    const isValid = await qstashReceiver.verify({
      // Needs rawBody since the signature is signed on the raw bytes and will
      // not work with the parsed req.body JSON
      body: rawRequestBody,
      signature,
    });

    if (!isValid) {
      throw new SignatureError("invalid");
    }

    // Verify the body to be a specific schema/shape that we want
    req.qstashEvent = qstashEventSchema.parse({
      qstashMessageID,
      ...req.body,
    });

    next();
  } catch (e) {
    const error = convertUnknownCatchToError(e);

    if (error instanceof SignatureError) {
      throw new UnauthorizedException(
        `Invalid Qstash Webhook Signature: ${error.message}`,
      );
    }

    throw new ValidationFailedException(error.message);
  }
}
