import type { User } from "@workos-inc/node";

import express from "express";

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
    const target = req.query["target"]?.toString() || "web";
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      clientId: WORKOS_CLIENT_ID,

      // Use AuthKit to handle the authentication flow
      provider: "authkit",

      // Callback endpoint that WorkOS redirects to after a user authenticates
      redirectUri: WORKOS_REDIRECT_URI,

      // Encode target in state to know how to respond in callback
      state: JSON.stringify({ target }),
    });

    // For web: redirect directly
    // For mobile: return JSON with authUrl (mobile will open it)
    if (target === "mobile") {
      res.json({ authUrl: authorizationUrl });
    } else {
      res.redirect(authorizationUrl);
    }
  })

  // Called after user successfully authenticates
  // This is the "WORKOS_REDIRECT_URI"
  .get("/auth/workos/login/callback", async (req, res) => {
    // Get authorization code string returned by AuthKit
    const code = req.query["code"]?.toString?.();

    // Decode state to determine client type
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

      // Handle based on client type
      if (state.target === "mobile") {
        const userData = mapWorkOsUser(authenticationResponse.user);
        // For mobile: redirect to app with tokens
        return res.redirect(
          `voieech://auth/callback?` +
            `accessToken=${encodeURIComponent(
              authenticationResponse.accessToken,
            )}` +
            `&refreshToken=${encodeURIComponent(
              authenticationResponse.refreshToken,
            )}` +
            `&user=${encodeURIComponent(JSON.stringify(userData))}`,
        );
      } else {
        // For web: store cookie in session and redirect to homepage
        res.cookie(WORKOS_COOKIE_NAME, authenticationResponse.sealedSession, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        });

        // Use the information in `user` as needed for other business logic
        // authenticationResponse.user;
        // @todo Modifiable
        // Redirect the user to the homepage
        res.redirect("/");
        return;
      }
    } catch (error) {
      // Redirect to login based on client type
      if (state.target === "mobile") {
        res.redirect("voieech://auth/error");
      } else {
        res.redirect("/auth/workos/login");
      }
      return;
    }
  })

  // Refresh endpoint for mobile
  .post("/auth/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        error: "No refresh token provided",
        user: null,
        accessToken: null,
        refreshToken: null,
      });
      return;
    }

    try {
      const refreshed =
        await workos.userManagement.authenticateWithRefreshToken({
          refreshToken,
          clientId: WORKOS_CLIENT_ID,
        });

      res.json({
        user: mapWorkOsUser(refreshed.user),
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
      });
    } catch (error) {
      res.status(401).json({
        error: "Invalid or expired refresh token",
        user: null,
        accessToken: null,
        refreshToken: null,
      });
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

function mapWorkOsUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerified: user.emailVerified,
    profilePictureUrl: user.profilePictureUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
