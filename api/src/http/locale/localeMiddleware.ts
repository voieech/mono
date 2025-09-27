import type { Request, Response, NextFunction } from "express";

import { convertAcceptLanguageHeaderToMaybeString } from "./convertAcceptLanguageHeaderToMaybeString.js";
import { convertUrlQueryParamToMaybeString } from "./convertUrlQueryParamToMaybeString.js";
import { DEFAULT_FALLBACK_LOCALE } from "./DEFAULT_FALLBACK_LOCALE.js";
import { isLocaleSupported } from "./supportedLocales.js";

// Add locale to express Request type globally.
// Assumes localeMiddleware will be used before all use of `req.locale`.
declare global {
  namespace Express {
    interface Request {
      locale: string;
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
  res: Response,
  next: NextFunction,
) {
  const rawLocale =
    convertUrlQueryParamToMaybeString(req.query["locale"]) ??
    convertUrlQueryParamToMaybeString(req.query["lang"]) ??
    convertAcceptLanguageHeaderToMaybeString(req.headers["accept-language"]) ??
    DEFAULT_FALLBACK_LOCALE;

  // Get validated supported locale or fallback locale
  const locale = isLocaleSupported(rawLocale)
    ? rawLocale
    : DEFAULT_FALLBACK_LOCALE;

  req.locale = locale;

  // Set content-language response headers automatically to the validated locale
  // value instead of making every API controller set it manually.
  res.set("Content-Language", locale);

  next();
}
