import type { Request, Response, NextFunction } from "express";

import { convertAcceptLanguageHeaderToMaybeStringArray } from "./convertAcceptLanguageHeaderToMaybeStringArray.js";
import { convertUrlQueryParamToMaybeStringArray } from "./convertUrlQueryParamToMaybeStringArray.js";
import { DEFAULT_FALLBACK_LOCALES } from "./DEFAULT_FALLBACK_LOCALE.js";
import { isLocaleSupported } from "./supportedLocales.js";

// Add locale to express Request type globally.
// Assumes localeMiddleware will be used before all use of `req.locale`.
declare global {
  namespace Express {
    interface Request {
      locales: Array<string>;
    }
  }
}

/**
 * Middleware to get request locale value from various sources in order, before
 * validating that it is a supported locale and setting it to the global express
 * `Request` object. This will also set the response `Content-Language` header.
 */
export function localeMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const rawLocales =
    convertUrlQueryParamToMaybeStringArray(req.query["locale"]) ??
    convertUrlQueryParamToMaybeStringArray(req.query["lang"]) ??
    convertAcceptLanguageHeaderToMaybeStringArray(
      req.headers["accept-language"],
    ) ??
    DEFAULT_FALLBACK_LOCALES;

  // Check if language is a valid option first before even attempting to
  // querying DB, instead of relying on the DB query to check if language is
  // valid.
  // @todo Use $LanguageCode.makeStrongSafely
  const filteredRawLocales = rawLocales.filter((rawLocale) =>
    isLocaleSupported(rawLocale),
  );

  req.locales =
    filteredRawLocales.length === 0
      ? DEFAULT_FALLBACK_LOCALES
      : filteredRawLocales;

  // Note that content-language header is not set since we support APIs that can
  // return content in multiple languages and in those cases setting this header
  // is not advised.

  next();
}
