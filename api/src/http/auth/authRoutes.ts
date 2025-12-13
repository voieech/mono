import express from "express";

import { signMobileJwt } from "./jwt.js";
import {
  workos,
  WORKOS_CLIENT_ID,
  WORKOS_REDIRECT_URI,
  WORKOS_COOKIE_PASSWORD,
  WORKOS_COOKIE_NAME,
} from "./workos.js";

/**
 * Routes for auth using WorkOS
 */
export const authRoutes = express
  .Router()

  // Redirect user here to generate WorkOS AuthKit link for user to authenticate
  .get("/auth/workos/login", (req, res) => {
    const target = req.query["target"] ?? "web";
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      clientId: WORKOS_CLIENT_ID,

      // Use AuthKit to handle the authentication flow
      provider: "authkit",

      // Callback endpoint that WorkOS redirects to after a user authenticates
      redirectUri: WORKOS_REDIRECT_URI,

      // Encode context in state
      state: JSON.stringify({ target }),
    });

    // Redirect the user to the AuthKit sign-in page
    res.redirect(authorizationUrl);
  })

  // Called after user successfully authenticates
  // This is the "WORKOS_REDIRECT_URI"
  .get("/auth/workos/login/callback", async (req, res) => {
    // Get authorization code string returned by AuthKit
    const code = req.query["code"]?.toString?.();

    const state = req.query["state"]
      ? JSON.parse(req.query["state"].toString())
      : { target: "web" };

    if (code === undefined) {
      res.status(400).send("No auth code provided");
      return;
    }

    try {
      const authenticationResponse =
        await workos.userManagement.authenticateWithCode({
          code,
          clientId: WORKOS_CLIENT_ID,
          session: {
            sealSession: true,
            cookiePassword: WORKOS_COOKIE_PASSWORD,
          },
        });

      // Store the session in a cookie
      res.cookie(WORKOS_COOKIE_NAME, authenticationResponse.sealedSession, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      // Use the information in `user` as needed for other business logic
      // authenticationResponse.user;

      // Redirect based on client type
      if (state.target === "mobile") {
        const token = signMobileJwt({
          id: authenticationResponse.user.id,
          email: authenticationResponse.user.email,
        });

        return res.redirect(
          `voieech://auth/callback?token=${encodeURIComponent(token)}`,
        );
      }

      // @todo Modifiable
      // Redirect the user to the homepage
      res.redirect("/");
      return;
    } catch (error) {
      res.redirect("/auth/workos/login");
      return;
    }
  })

  // Redirect here to log user out
  .get("/auth/workos/logout/", async (req, res) => {
    res.redirect(
      await workos.userManagement
        .loadSealedSession({
          sessionData: req.cookies[WORKOS_COOKIE_NAME],
          cookiePassword: WORKOS_COOKIE_PASSWORD,
        })
        .getLogoutUrl(),
    );
    res.clearCookie(WORKOS_COOKIE_NAME);
  });
